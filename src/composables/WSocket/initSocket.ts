import { type Ref } from "vue";
import { useIcon } from "./useIcon";
import { useRoom } from "./useRoom";
import { useTitle } from "./useTitle";
import { useUsers } from "./useUsers";
import { createAIListener } from "./useAIListener";
import type { User } from "@/assets/ts/type";

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

    const { join, leave } = useRoom();
    const { createIconAutoSync } = useIcon();
    const { createTitleAutoSync } = useTitle();

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

    console.log(`Socket initialized for room ${room}!`);

    const closeSocket = () => {
        console.log(`Closing socket for room ${room}...`);
        close();
        stopIconAutoSync();
        stopTitleAutoSync();
        stopAIListener();
        leave(room);
        console.log(`Socket closed for room ${room}!`);
    }

    return { closeSocket }
}

export { initSocket }