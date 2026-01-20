import { ref } from "vue";
import { wsocket } from "./useWebSocket"

const socketConnected = ref<boolean>(false);

const useRoom =
() =>
{

    const join = (room: string) => {
        wsocket.emit('join-room', room);
        socketConnected.value = true;
    }

    const leave = (room: string) => {
        wsocket.emit('leave-room', room);
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

