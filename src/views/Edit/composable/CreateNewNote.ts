import database from "@/assets/ts/database/database";
import { Notes } from "@/assets/ts/database/Var";
import type { Note } from "@/assets/ts/type";
import utils from "@/assets/ts/utils";

export default 
async function
()
{

    const note: Note = {
        uuid: await utils.UUID(),
        icon: '',
        title: '',
        content: '',
        date: utils.date(),
        pinned: false,
        tags: []
    };

    Notes.value.push(note);
    await database.create(note);
    
}