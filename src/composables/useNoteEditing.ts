import { onBeforeUnmount, onMounted, ref, watch, type ComputedRef, type Ref } from "vue";
import { useWSocket } from "./WSocket";
import { Notes } from "@/assets/ts/database/Var";
import type { Note } from "@/assets/ts/type";
import CreateNewNote from "@/views/Edit/composable/CreateNewNote";
import router from "@/router";
import { Socket } from "socket.io-client";


interface LocalNote {
    id: string;
    title: string;
    icon: string;
    pinned: boolean;
    loaded: boolean;
}


function useNoteEditing (noteId: Ref<string> | ComputedRef<string>)
{

    let socket: Ref<Socket>;
    let clearListener: () => void;

    const localNote = ref<LocalNote>({
        id: '',
        title: '',
        icon: '',
        pinned: false,
        loaded: false
    })


    watch(() => noteId.value, async (newNoteId) => await mount(newNoteId));
    onMounted(async () => await mount(noteId.value));


    const mount = async (noteId: string) => {

        if (clearListener) clearListener();
        localNote.value.loaded = false;

        socket = await useWSocket();
        let note: Note | undefined = Notes.value.find(note => note.uuid == noteId);

        if (!note) 
        {

            const newNote = await CreateNewNote();
            router.push({ 
                params: { ...router.currentRoute.value.params, uuid: newNote.uuid }
            });

            // return !!! : router.push update props.uuid then a new mount,
            return; 

        }


        socket.value.once('initial-state', ({ note }: { note: Note }) => {

            if (note.uuid !== noteId) return;

            localNote.value = {
                id: note.uuid,
                title: note.title,
                icon: note.icon,
                pinned: note.pinned,
                loaded: true
            }

            clearListener = initListener();
            document.title = `${localNote.value.title} - Silvernote`;

        })

        socket.value.emit('join-room', { room: note.uuid });

    }


    const initListener = () => {

        socket.value.on('title-update', ({ roomId, update }: { roomId: string, update: string }) => {

            if (roomId != localNote.value.id || localNote.value.title == update) return;
            document.title = `${update} - Silvernote`;
            localNote.value.title = update;

        })

        socket.value.on('icon-update', ({ roomId, update }: { roomId: string, update: string }) => {

            if (roomId != localNote.value.id || localNote.value.icon == update) return;
            localNote.value.icon = update;

        })

        const iconEmitWatch = watch(() => localNote.value.icon, (newIcon, oldIcon) => {
            if (newIcon == oldIcon) return;
            socket.value.emit('icon-update', { roomId: localNote.value.id, update: newIcon });
        })

        const titleEmitWatch = watch(() => localNote.value.title, (newTitle, oldTitle) => {
            if (newTitle == oldTitle) return;
            document.title = `${newTitle} - Silvernote`;
            socket.value.emit('title-update', { roomId: localNote.value.id, update: newTitle });
        })

        return () => {
            iconEmitWatch();
            titleEmitWatch();
            socket.value.off('title-update');
            socket.value.off('icon-update');
            socket.value.emit('leave-room', { room: localNote.value.id });
        }

    }

    onBeforeUnmount(() => {
        if (clearListener) clearListener();
    })

    return {
        localNote
    }

}

export default useNoteEditing;

export type {
    LocalNote
}