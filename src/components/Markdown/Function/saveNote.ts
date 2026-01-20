import { api_url } from "@/assets/ts/backend_link";
import { editor } from "../Editor";
import type { Note } from "@/assets/ts/type";
import { Notes } from "@/assets/ts/database/Var";


let isSaving = false;
let lastSavedContent = '';

export const saveNote = async (uuid: string) => 
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

    const note = Notes.value.find(note => note.uuid == uuid);

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

        note.content = newContent;
        console.log('Saved to local DB');

        const response = await fetch(`${api_url}/api/db/update/a/note`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await window.Clerk?.session?.getToken() ?? ''}`
            },
            credentials: 'include',
            body: JSON.stringify({ note: newNote })
        });

        if (!response.ok) {
            throw new Error(`Server save failed: ${response.status}`);
        }

        console.log('Saved to server');
        lastSavedContent = newContent;

        window.dispatchEvent(new CustomEvent('note-saved', {
            detail: { noteId: uuid, timestamp: Date.now() }
        }));

    } catch (error) {

        console.error('Error saving note:', error);

        window.dispatchEvent(new CustomEvent('note-save-error', {
            detail: { noteId: uuid, error }
        }));

        throw error; // Re-throw pour permettre la gestion d'erreur en amont
        
    } finally {
        isSaving = false;
    }

};


export const forceSaveNote = async (uuid: string) => {
  lastSavedContent = '';
  await saveNote(uuid);
};


export const resetSaveState = () => {
  lastSavedContent = '';
  isSaving = false;
};