import { editor } from "../Editor";
import { Notes } from "@/assets/ts/database/Var";
import database from "@/assets/ts/database/database";


let isSaving = false;

export const saveNote = async (uuid: string, { force = false } = {}) => 
{
        
    if (isSaving && !force) {
        console.log('Save already in progress, skipping...');
        return;
    }

    const note = Notes.value.find(note => note.uuid == uuid);

    if (!note) {
        console.warn('Note not found in local DB');
        return;
    }

    const newContent = editor.value?.getHTML();
    
    if (!newContent) {
        console.warn('No content to save');
        return;
    }

    if (newContent === note.content && !force) {
        console.log('Content matches DB, no save needed');
        return;
    }

    isSaving = true;

    window.dispatchEvent(new CustomEvent('note-saving'));

    try {
        
        note.content = newContent;
        await database.update(note);

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
  await saveNote(uuid, { force: true });
};


export const resetSaveState = () => {
  isSaving = false;
};