import { api_url } from "@/assets/ts/backend_link";
import { io, type Socket } from "socket.io-client";
import { ref, type Ref } from "vue";


const wsocketHost: string = 
  api_url === "http://localhost:3000" 
    ? "http://localhost:3434" 
    : api_url;

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

        const token = await window.Clerk.session?.getToken();

        if (!token) throw new Error("No token found");

        socket.value = io(wsocketHost, {
            path: "/socket",
            auth: { token },
            reconnection: true,
            autoConnect: true,
            reconnectionAttempts: 5
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