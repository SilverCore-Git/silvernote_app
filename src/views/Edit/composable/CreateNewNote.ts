import { Notes } from "@/assets/ts/database/Var";
import type { Note } from "@/assets/ts/type";
import utils from "@/assets/ts/utils";
import { useWSocket } from "@/composables/WSocket";

export default 
async function
(): Promise<Note>
{

    const note: Note = {
        uuid: await utils.UUID(),
        icon: '',
        title: '',
        content: '',
        date: new Date().toISOString(),
        pinned: false,
        tags: [],
        content_type: 'text/html/crypted'
    };

    Notes.value.push(note);
    (await useWSocket()).value.emit('note:create', note);

    return note;
    
}