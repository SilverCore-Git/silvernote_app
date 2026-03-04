import { ref } from "vue";
import useWSocket from "./useWebSocket";

const socketConnected = ref<boolean>(false);

const useRoom =
async () =>
{

    const wsocket = await useWSocket();

    const join = (params: { room: string, userId: string }) => {
        wsocket.value.emit('join-room', params);
        setTimeout(() => {
            socketConnected.value = true;
        }, 200);
    }

    const leave = (room: string) => {
        wsocket.value.emit('leave-room', { room });
        socketConnected.value = false;
    }

    return {
        join,
        leave
    }

}

export {
    useRoom,
    socketConnected
} 

