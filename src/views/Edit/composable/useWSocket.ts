import { api_url } from "@/assets/ts/backend_link";
import type { Note } from "@/assets/ts/type";
import useUser from "@/composables/useUser";
import { io, type Socket } from "socket.io-client";
import { watch, type ComputedRef, type Ref } from "vue";

const { getUserByUUID } = useUser();

let socket: Socket;

socket = io(
  api_url == 'http://localhost:3000'
    ? 'http://localhost:3434'
    : api_url, 
  { path: "/socket.io/share" }
);

export default function
({ 
    note, 
    users, 
    shared, 
    user 
}
:
{ 
    note: ComputedRef<Note | undefined> | Ref<Note | undefined>, 
    users: Ref<any[]>, 
    shared: Ref<boolean>, 
    user: Ref<any> 
}): { socket?: Socket }
{

    const join = () => {
        if (note.value?.uuid) {
            socket.emit("join-room", { 
                room: note.value.uuid, 
                userId: user.value?.id
            });
        }
    }

    if (socket.connected) join();
    socket.on('connect', join);
    
    socket.on('new_user', async (userId: string) => {

        if (!shared.value || !userId) return;

        const user_visitor = await getUserByUUID(userId, 'visitor');
        const user_owner = await getUserByUUID(userId, 'owner');

        if (!user_owner || !user_visitor) return;
        if (users.value.includes(user_visitor)) return;
        if (users.value.includes(user_owner)) return;

        if (!users.value.includes(user_visitor) && !users.value.includes(user_owner)) 
        {
          users.value.push(user_visitor);
        }

    })

    let ignoreNextUpdate: boolean = false;
    socket.on('title-update', (update: string) => {
    if (note.value && note.value.title !== update) {
        ignoreNextUpdate = true;
        note.value.title = update;
    }
    });

    socket.on('icon-update', async (update: string) => {
        if (note.value && note.value.icon !== update) {
            note.value.icon = update;
        }
    })

    socket.on('disconnect', () => {
        console.log('WebSocket déconnecté !');
    });

    watch(() => note.value?.title, () => {

        if (ignoreNextUpdate) {
          ignoreNextUpdate = false;
          return;
        }

        debounceEmit(note.value?.title);

      }
    );

    let timeout: any;
    function debounceEmit(title?: string) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        socket.emit('title-update', title);
      }, 500);
    }

    watch(() => note.value?.icon, () => {
      socket.emit('icon-update', note.value?.icon);
    })

    return {
      socket
    }

};

