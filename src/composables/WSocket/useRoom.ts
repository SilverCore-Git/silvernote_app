import { ref } from "vue";
import { wsocket } from "./useWebSocket"

const socketConnected = ref<boolean>(false);

const useRoom =
() =>
{

    const join = (params: { room: string, userId: string }) => {
        wsocket.emit('join-room', params);
        setTimeout(() => {
            socketConnected.value = true;
        }, 200);
    }

    const leave = (room: string) => {
        wsocket.emit('leave-room', { room });
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

