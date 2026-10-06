import { api_url } from "@/assets/ts/backend_link";
import { io, type Socket } from "socket.io-client";
import { ref, type Ref } from "vue";


// Le serveur bun (app.bun.ts), utilisé en dev comme en prod, intègre Socket.io
// directement sur le même port que l'API REST (voir app.bun.ts). Le port 3434
// correspondait à l'ancien serveur WebSocket séparé (wsocket/ws.ts), utilisé
// uniquement par l'entrypoint Node (app.ts), qui n'est plus celui exécuté.
const wsocketHost: string = api_url;

const socket = ref<Socket | null>(null);
const isConnecting = ref<boolean>(false);

const useWSocket = async (): Promise<Ref<Socket | null>> => {
    
    if (socket.value?.connected) return socket as Ref<Socket | null>;

    if (isConnecting.value)
    {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (socket.value) {
                    clearInterval(check);
                    resolve(socket as Ref<Socket | null>);
                }
            }, 100);
        });
    }

    isConnecting.value = true;

    try {

        const currentToken = await window.Clerk.session?.getToken();

        socket.value = io(wsocketHost, {
            path: "/socket",
            auth: { token: currentToken },
            reconnection: true,
            autoConnect: true,
            reconnectionAttempts: 5
        });

        socket.value.on("reconnect_attempt", async () => {
            
            const newToken = await window.Clerk.session?.getToken();
            
            if (socket.value) 
            {
                socket.value.auth = { token: newToken };
            }

        });

        socket.value.on("connect", () => {
            console.log("[WS] Connected with ID:", socket.value?.id);
            isConnecting.value = false;
        });

        socket.value.on("connect_error", (err) => {
            console.error("[WS] Connection Error:", err.message);
            isConnecting.value = false;
        });

    } 
    catch (error) 
    {
        console.error("[WS] Auth Error:", error);
        isConnecting.value = false;
    }

    return socket as Ref<Socket | null>;
    
};

export default useWSocket;