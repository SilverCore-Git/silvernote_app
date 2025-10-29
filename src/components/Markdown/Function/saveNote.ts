import { api_url } from "@/assets/ts/backend_link";
import { editor } from "../Editor";
import db from "@/assets/ts/database/database";
import type { Note } from "@/assets/ts/type";

export const saveNote = async (id: number) => {

    const newContent = editor.value?.getHTML();
    const note = await db.getNote(id);

    if (newContent && note) 
    {

        if (newContent === note.content) return;

        const newNote: Note = { ...note, content: newContent };
        await db.saveContent(newContent, id);
        await fetch(`${api_url}/api/db/update/a/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ note: newNote })
        });

    }

};