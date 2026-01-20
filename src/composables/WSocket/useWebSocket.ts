import { api_url } from "@/assets/ts/backend_link";
import { io, type Socket } from "socket.io-client";


const wsocketHost: string = 
  api_url === "http://localhost:3000" 
    ? "http://localhost:3434" 
    : api_url;

const wsocket: Socket = io(wsocketHost, {
  path: "/socket.io/share",
  transports: ["websocket", "polling"],
  autoConnect: true,
});


export {
    wsocket,
    wsocketHost
}