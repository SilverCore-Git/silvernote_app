import { onUnmounted, type Ref } from "vue";
import { useIcon } from "./useIcon";
import { useRoom } from "./useRoom";
import { useTitle } from "./useTitle";
import { useUsers } from "./useUsers";
import { createAIListener } from "./useAIListener";
import type { User } from "@/assets/ts/type";

const { join, leave } = useRoom();
const { createIconAutoSync } = useIcon();
const { createTitleAutoSync } = useTitle();

let initialized = false;
let closeSocket: () => void = () => {};


function initSocket ({
    room,
    users,
    title,
    icon,
    userId
}: {
    room: string,
    users: Ref<User[]>,
    title: Ref<string | undefined>,
    icon: Ref<string | undefined>,
    userId: string
}): { closeSocket: () => void }
{

    if (initialized) return { closeSocket };
    initialized = true;

    join({ room, userId });

    const { stopIconAutoSync } = createIconAutoSync(icon);
    const { stopTitleAutoSync } = createTitleAutoSync(title);
    const { stopAIListener } = createAIListener({
        room,
        title,
        icon
    })
    const { start, close } = useUsers(users);
    start();

    console.log('Socket initialized !');

    closeSocket = () => {
        close();
        stopIconAutoSync();
        stopTitleAutoSync();
        stopAIListener();
        leave(room);
        initialized = false;
        console.log('Socket closed !');
    }

    onUnmounted(() => {
        closeSocket();
    });

    return {
        closeSocket
    }

}


export {
    initSocket
}