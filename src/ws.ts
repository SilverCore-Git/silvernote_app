import { Server } from "socket.io";
import { httpServer } from "./app";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import config from './config.json';

const io = new Server(httpServer, {
  cors: { origin: config.corsOptions.origin, methods: ["GET", "POST"] },
});

const docs = new Map<string, { ydoc: Y.Doc; awareness: awarenessProtocol.Awareness }>();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join-room", ({ room }: { room: string }) => {
    let docData = docs.get(room);

    if (!docData) {
      const ydoc = new Y.Doc();
      const awareness = new awarenessProtocol.Awareness(ydoc);
      docs.set(room, { ydoc, awareness });
      docData = { ydoc, awareness };
    }

    const { ydoc, awareness } = docData;
    socket.join(room);

    // send full document to new client
    socket.emit("sync", Y.encodeStateAsUpdate(ydoc));

    // Handle Yjs updates from client
    socket.on("y-update", (update: Uint8Array) => {
      Y.applyUpdate(ydoc, update, socket);
      socket.to(room).emit("y-update", update);
    });

    // Broadcast updates from server to clients
    const onYDocUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin !== socket) {
        socket.to(room).emit("y-update", update);
      }
    };
    ydoc.on("update", onYDocUpdate);

    // Awareness from client
    socket.on("awareness-update", (update: Uint8Array) => {
      awarenessProtocol.applyAwarenessUpdate(awareness, update, socket);
      socket.to(room).emit("awareness-update", update);
    });

    // Broadcast awareness changes from server
    const onAwarenessUpdate = ({ added, updated, removed }: any, origin: unknown) => {
      if (origin !== socket) {
        const changed = added.concat(updated).concat(removed);
        const update = awarenessProtocol.encodeAwarenessUpdate(awareness, changed);
        socket.to(room).emit("awareness-update", update);
      }
    };
    awareness.on("update", onAwarenessUpdate);

    // Clean up on disconnect
    socket.on("disconnect", () => {
      ydoc.off("update", onYDocUpdate);
      awareness.off("update", onAwarenessUpdate);
      console.log("Client disconnected:", socket.id);
    });
  });
});

console.log("Socket.IO server running…");
