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
  path: "/socket.io/",
  transports: ["websocket", "polling"]
});

const docs = new Map<string, { 
  ydoc: Y.Doc, 
  awareness: awarenessProtocol.Awareness 
}>();



io.on("connection", (socket) => {

  console.log("Client connected :", socket.id);

  socket.on("join-room", async ({ room }) => {

    if (!room) return;

    socket.join(room);
    
    let docData = docs.get(room);

    if (!docData) {

      const ydoc = new Y.Doc();
      const awareness = new awarenessProtocol.Awareness(ydoc);
      
      const note: Note | undefined = await get_note(room);
      const ytext = ydoc.getText("note");

      if (note?.content) {
        ytext.insert(0, note.content);
      }

      docs.set(room, { ydoc, awareness });
      docData = { ydoc, awareness };

    }

    const { ydoc, awareness } = docData;

    const initialUpdate = Y.encodeStateAsUpdate(ydoc);
    socket.emit("sync", new Uint8Array(initialUpdate));



    socket.on("y-update", (update: Uint8Array) => {

      try {

        const uint8Array = new Uint8Array(update);
        Y.applyUpdate(ydoc, uint8Array);

        socket.to(room).emit("y-update", uint8Array);

      } catch (error) {
        console.error("Error applying update:", error);
      }

    });


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

      const { ydoc } = docData;
      const content = ydoc.getText("note").toString();

      const note: Note | undefined = await get_note(roomId);
      if (note) {
        await save_note({
          ...note,
          content: content
        });
      }
      
      awareness.setLocalState(null);
      
      
      if (room && io.sockets.adapter.rooms.get(room)?.size === 0) {
        docs.delete(room);
      }
      
      console.log("Client disconnected:", socket.id);

    });


  });


});



console.log("Socket.IO server running...");


export { io };