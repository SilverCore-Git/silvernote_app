import { Server } from "socket.io";
import { httpServer } from "./app";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import config from './config.json';
import notes from "./assets/ts/notes";
import { Note } from "./assets/ts/types";



const save_note = async (note: Note): Promise<void> => {
  await notes.updateNote({
    ...note,
    updated_at: new Date().getDate()
  });
}

const get_note = async (uuid: string): Promise<Note | undefined> => {
  const res = await notes.getNoteByUUID(uuid);
  if (res.note) return res.note;
}


const io = new Server(httpServer, {
  cors: { origin: config.corsOptions.origin, methods: ["GET", "POST"] },
  path: "/socket.io/share",
  transports: ["websocket", "polling"]
});

const docs = new Map<string, { 
  ydoc: Y.Doc, 
  awareness: awarenessProtocol.Awareness,
  saveInterval?: NodeJS.Timeout,
  title: string,
  icon: string
}>();



io.on("connection", (socket) => {

  console.log("Client connected :", socket.id);

  socket.on("join-room", async ({ room, userId }: { room: string, userId?: string }) => {
    if (!room) return;
    socket.join(room);
    
    let docData = docs.get(room);

    if (!docData) {
      const ydoc = new Y.Doc();
      new Y.Text();
      const ytext = ydoc.getText('note');

      const awareness = new awarenessProtocol.Awareness(ydoc);
      const note = await get_note(room);
      
      const title = note?.title || "";
      const icon = note?.icon || "";
      
      if (note?.content) {
        // S'assurer que le document est vide avant d'insérer
        if (ytext.length > 0) {
          ytext.delete(0, ytext.length);
        }
        ytext.insert(0, note.content);
        // Force une mise à jour initiale
        Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(ydoc));
      }

      const saveNote = async () => {
        const currentDoc = docs.get(room);
        const currentNote = await get_note(room);
        if (currentNote && currentDoc) {
            await save_note({
              ...currentNote,
              title: currentDoc.title,
              icon: currentDoc.icon
            });
        }
      }
      
      await saveNote();
      const saveInterval = setInterval(async () => {
        await saveNote();
      }, 10000);

      docs.set(room, { ydoc, awareness, saveInterval, title, icon });
      docData = { ydoc, awareness, saveInterval, title, icon };
    }

    const { ydoc, awareness } = docData;

    // Envoi de l'état complet
    const initialState = Y.encodeStateAsUpdate(ydoc);
    socket.emit("sync", initialState);
    if (userId) {
      socket.emit('new_user', userId);
    }

    socket.on("y-update", async (update: Uint8Array) => {
      try {

        const uint8Array = new Uint8Array(update);
        Y.applyUpdate(ydoc, uint8Array);
        socket.to(room).emit("y-update", uint8Array);
        
      } catch (error) {
        console.error("Error applying update:", error);
      }
    });


    socket.on('title-update', async (update: string) => {
      try {
        const currentDoc = docs.get(room);
        if (currentDoc) {
          currentDoc.title = update;
          socket.to(room).emit("title-update", update);

          const currentNote = await get_note(room);
          await save_note({
              ...currentNote!,
              title: update
          });
        }
      } catch (error) {
        console.error("Error applying update:", error);
      }
    });

    socket.on('icon-update', async (update: string) => {
      try {
        const currentDoc = docs.get(room);
        if (currentDoc) {
          currentDoc.icon = update;
          socket.to(room).emit("icon-update", update);
        }
      } catch (error) {
        console.error("Error applying update:", error);
      }
    })

    socket.on("awareness-update", (update: Uint8Array) => {

      try {

        const uint8Array = new Uint8Array(update);
        awarenessProtocol.applyAwarenessUpdate(awareness, uint8Array, socket);
        
        socket.to(room).emit("awareness-update", uint8Array);

      } catch (error) {
        console.error("Error applying awareness update:", error);
      }

    });

    socket.on("disconnect", async () => {

      const roomId = Array.from(socket.rooms)[1];
      if (!roomId) return;

      const docData = docs.get(roomId);
      if (!docData) return;

      const { ydoc, saveInterval } = docData;
      const content = ydoc.getText("note").toString();

      const note: Note | undefined = await get_note(roomId);
      if (note) {
        await save_note({
          ...note,
          content,
          title: docData.title,
          icon: docData.icon
        });
      }
      
      awareness.setLocalState(null);
      
      if (room && io.sockets.adapter.rooms.get(room)?.size === 0) {
        // Clear the save interval when the last user leaves
        if (saveInterval) {
          clearInterval(saveInterval);
        }
        docs.delete(room);
      }
      
      console.log("Client disconnected:", socket.id);

    });


  });


});



console.log("Socket.IO server running...");


export { io };