import { api_url } from "@/assets/ts/backend_link";
import { editor } from "../Editor";
import db from "@/assets/ts/database/database";
import type { Note } from "@/assets/ts/type";


let isSaving = false;
let lastSavedContent = '';

export const saveNote = async (id: number) => 
{
  
        
    if (isSaving) {
        console.log('Save already in progress, skipping...');
        return;
    }

    const newContent = editor.value?.getHTML();
    
    if (!newContent) {
        console.warn('No content to save');
        return;
    }

    if (newContent === lastSavedContent) {
        console.log('Content unchanged since last save, skipping...');
        return;
    }

    const note = await db.getNote(id);

    if (!note) {
        console.error('Note not found in local DB');
        return;
    }

    if (newContent === note.content) {
        console.log('Content matches DB, no save needed');
        lastSavedContent = newContent;
        return;
    }

    isSaving = true;

    window.dispatchEvent(new CustomEvent('note-saving'));

    try {
        const newNote: Note = { 
            ...note, 
            content: newContent,
            updated_at: new Date().getTime()
        };

        await db.saveContent(newContent, id);
        console.log('Saved to local DB');

        const response = await fetch(`${api_url}/api/db/update/a/note`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ note: newNote })
        });

        if (!response.ok) {
            throw new Error(`Server save failed: ${response.status}`);
        }

        console.log('Saved to server');
        lastSavedContent = newContent;

        window.dispatchEvent(new CustomEvent('note-saved', {
            detail: { noteId: id, timestamp: Date.now() }
        }));

    } catch (error) {

        console.error('Error saving note:', error);

        window.dispatchEvent(new CustomEvent('note-save-error', {
            detail: { noteId: id, error }
        }));

        throw error; // Re-throw pour permettre la gestion d'erreur en amont
        
    } finally {
        isSaving = false;
    }

};


export const forceSaveNote = async (id: number) => {
  lastSavedContent = '';
  await saveNote(id);
};


export const resetSaveState = () => {
  lastSavedContent = '';
  isSaving = false;
};