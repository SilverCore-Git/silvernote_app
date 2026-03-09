import { nextTick, onBeforeUnmount, onMounted, ref, watch, type ComputedRef, type Ref } from "vue";
import { useRoom, useWSocket } from "./WSocket";
import { Notes } from "@/assets/ts/database/Var";
import type { Note } from "@/assets/ts/type";
import CreateNewNote from "@/views/Edit/composable/CreateNewNote";
import router from "@/router";
import { Socket } from "socket.io-client";
import waitFor from "@/assets/ts/utils/waitFor";


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

        return async function ()
        {

            iconEmitWatch();
            titleEmitWatch();
            socket.value.off('title-update');
            socket.value.off('icon-update');

            const note = Notes.value.find(note => note.uuid == localNote.value.id);
            if (!note) return;

            (await useWSocket()).value.emit('note:update', note);
            (await useWSocket()).value.emit('leave-room', { room: localNote.value.id });

        }

    }

    watch(() => noteId.value, async (newNoteId) => await mount(newNoteId));
    onMounted(async () => await mount(noteId.value));


    const mount = async (noteId: string) => {

        if (clearListener) clearListener();
        localNote.value.loaded = false;

        const { join } = await useRoom();
        socket = await useWSocket();
        waitFor(() => socket.value.connected, 10_000);

        let note: Note | undefined = Notes.value.find(note => note.uuid == noteId);

        if (!note || noteId == 'new') 
        {

            const newNote = await CreateNewNote();

            localNote.value.id = newNote.uuid;

            setTimeout(() => {

                console.log('note created')

                router.push({ 
                    params: { ...router.currentRoute.value.params, uuid: newNote.uuid }
                });

            }, 200);

            return;

        }

        console.log('load note')

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

        await nextTick();
        join({ room: noteId }); // join room

    }

    onBeforeUnmount(async () => {
        if (clearListener) await clearListener();
    })

    return {
        localNote
    }

}

export default useNoteEditing;

export type {
    LocalNote
}