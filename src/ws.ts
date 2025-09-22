import { Server } from "socket.io";
import { httpServer } from "./app";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import config from './config.json';
import notes from "./assets/ts/notes";
import { Note } from "./assets/ts/types";

const io = new Server(httpServer, {
  cors: { origin: config.corsOptions.origin, methods: ["GET", "POST"] },
  path: "/socket.io/",
  transports: ["websocket", "polling"]
});

// Store documents and their awareness states
const docs = new Map<string, { 
  ydoc: Y.Doc, 
  awareness: awarenessProtocol.Awareness 
}>();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle room joining
  socket.on("join-room", async ({ room }) => {
    if (!room) return;

    // Join the room
    socket.join(room);
    
    // Get or create document for this room
    let docData = docs.get(room);
    if (!docData) {
      const ydoc = new Y.Doc();
      const awareness = new awarenessProtocol.Awareness(ydoc);
      
      const note: Note | undefined = (await notes.getNoteByUUID(room)).note;
      const ytext = ydoc.getText('content');
      ytext.insert(0, note?.content ?? 'test');
      
      docs.set(room, { ydoc, awareness });
      docData = { ydoc, awareness };
    }

    const { ydoc, awareness } = docData;

    // Send initial document state
    const initialUpdate = Y.encodeStateAsUpdate(ydoc);
    socket.emit("sync", initialUpdate);

    // Handle document updates
    socket.on("y-update", (update: Uint8Array) => {
      try {
        const uint8Array = new Uint8Array(update);
        Y.applyUpdate(ydoc, uint8Array);
        // Broadcast to all clients in room except sender
        socket.to(room).emit("y-update", uint8Array);
      } catch (error) {
        console.error("Error applying update:", error);
      }
    });

    // Handle awareness updates
    socket.on("awareness-update", (update: Uint8Array) => {
      try {
        const uint8Array = new Uint8Array(update);
        awarenessProtocol.applyAwarenessUpdate(awareness, uint8Array, socket);
        // Broadcast awareness update to all clients in room except sender
        socket.to(room).emit("awareness-update", uint8Array);
      } catch (error) {
        console.error("Error applying awareness update:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      // Remove awareness state for disconnected client
      awareness.setLocalState(null);
      
      // If no clients left in the room, cleanup
      const room = Array.from(socket.rooms)[1]; // First room is always socket ID
      if (room && io.sockets.adapter.rooms.get(room)?.size === 0) {
        docs.delete(room);
      }
      
      console.log("Client disconnected:", socket.id);
    });
  });
});

console.log("Socket.IO server running...");

export { io };