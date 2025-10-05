import { io, Socket } from "socket.io-client";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";

export class SocketIOProvider {
  private socket: Socket;
  private doc: Y.Doc;
  private awareness;

  constructor(serverUrl: string, room: string, userId: string, doc: Y.Doc) {
    this.doc = doc;
    this.awareness = new awarenessProtocol.Awareness(doc);

    this.socket = io(serverUrl, {
      path: "/socket.io/share",
      transports: ["websocket", "polling"],
      autoConnect: true,
      forceNew: true,
      upgrade: false,
      reconnection: true,
    });

    this.socket.connect();

    this.socket.on("connect", () => {
      console.log("Connected to collaboration server");
      this.socket.emit("join-room", { room, userId });
    });

    // Handle initial sync
    this.socket.on("sync", (update: Uint8Array) => {
      try {
        const uint8Array = new Uint8Array(update);
        Y.applyUpdate(this.doc, uint8Array);
      } catch (error) {
        console.error("Error applying sync update:", error);
      }
    });

    // Handle updates
    this.socket.on("y-update", (update: ArrayBuffer) => {
      try {
        const uint8Array = new Uint8Array(update);
        Y.applyUpdate(this.doc, uint8Array);
      } catch (error) {
        console.error("Error applying y-update:", error);
      }
    });

    // Send updates
    this.doc.on("update", (update: Uint8Array) => {
      if (this.socket.connected) {
        try {
          this.socket.emit("y-update", update);
        } catch (error) {
          console.error("Error sending update:", error);
        }
      }
    });

    // Handle awareness updates
    this.awareness.on("update", ({ added, updated, removed }: any) => {
      if (this.socket.connected) {
        try {
          const changedClients = added.concat(updated).concat(removed);
          const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(
            this.awareness,
            changedClients
          );
          // Send the Uint8Array directly
          this.socket.emit("awareness-update", awarenessUpdate);
        } catch (error) {
          console.error("Error sending awareness update:", error);
        }
      }
    });

    this.socket.on("awareness-update", (update: ArrayBuffer) => {
      try {
        const uint8Array = new Uint8Array(update);
        awarenessProtocol.applyAwarenessUpdate(this.awareness, uint8Array, this.socket);
      } catch (error) {
        console.error("Error applying awareness update:", error);
      }
    });

    // Error handling
    this.socket.on("connect_error", (error: Error) => {
      console.error("Connection error:", error);
    });

    this.socket.on("error", (error: Error) => {
      console.error("Socket error:", error);
    });
  }

  destroy() {
    this.socket.disconnect();
    this.awareness.destroy();
  }
}