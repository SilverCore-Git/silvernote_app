import type { Socket } from "socket.io-client";
import type { Ref } from "vue";
import type { Note, Tag } from "../type";
import { Notes, Tags } from "./Var";


export default function (socket: Ref<Socket>)
{


    socket.value.on('connect', () => {
        socket.value.emit('user-connect');
    });



    // sync notes
    
    socket.value.on('note:create', (note: Note) => {
        
        Notes.value.push(note);

    });

    socket.value.on('note:update', (note: Note) => {

        const index = Notes.value.findIndex(n => n.uuid === note.uuid);
        if (index !== -1) {
            Notes.value[index] = note;
        }

    })

    socket.value.on('note:delete', (note: Note) => {

        Notes.value = Notes.value.filter(n => n.uuid !== note.uuid);

    })



    // sync tags

    socket.value.on('tag:create', (tag: Tag) => {
        
        Tags.value.push(tag);

    });

    socket.value.on('tag:update', (tag: Tag) => {

        const index = Tags.value.findIndex(n => n.uuid === tag.uuid);
        if (index !== -1) {
            Tags.value[index] = tag;
        }

    })

    socket.value.on('tag:delete', (tag: Tag) => {

        Tags.value = Tags.value.filter(n => n.uuid !== tag.uuid);

    })

}

