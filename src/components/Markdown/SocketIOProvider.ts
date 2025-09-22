import { io, Socket } from "socket.io-client";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";

export class SocketIOProvider {
  socket;
  room;
  doc;
  awareness;

  constructor(serverUrl: string, room: string, doc: Y.Doc) {
    this.room = room;
    this.doc = doc;
    this.awareness = new awarenessProtocol.Awareness(doc);

    this.socket = io(serverUrl, {
      transports: ["websocket"],
      autoConnect: true,
      forceNew: true,
      upgrade: false,
      reconnection: true,
    });

    this.socket.on("connect", () => {
      this.socket.emit("join-room", { room });
    });

    this.socket.on("sync", (update) => {
      Y.applyUpdate(this.doc, update, this.socket);
    });

    this.doc.on("update", (update: unknown, origin: unknown) => {
      if (origin !== this.socket) {
        this.socket.emit("y-update", update);
      }
    });

    this.socket.on("y-update", (update) => {
      Y.applyUpdate(this.doc, update, this.socket);
    });

    this.awareness.on("update", ({ added, updated, removed }: any) => {
      const changed = added.concat(updated).concat(removed);
      const update = awarenessProtocol.encodeAwarenessUpdate(this.awareness, changed);
      this.socket.emit("awareness-update", update);
    });

    this.socket.on("awareness-update", (update) => {
      awarenessProtocol.applyAwarenessUpdate(this.awareness, update, this.socket);
    });
  }

  destroy() {
    this.socket.disconnect();
    this.awareness.destroy();
  }
}