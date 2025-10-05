import type { Editor } from "@tiptap/vue-3";
import { createEditorState } from '../Editor';

const { editor, isLoaded } = createEditorState();


class Stats {

    public editor: Editor;

    constructor(editor: Editor) {
        this.editor = editor;
    }


    public getCharacterCount(): number {
        return this.editor.storage.characterCount.characters();
    }

    public getWordCount(): number {
        return this.editor.storage.characterCount.words();
    }


    public getAll() {
        return {
        characters: this.getCharacterCount(),
        words: this.getWordCount(),
        };
    }
    
}


let stats: Stats | null = null;

const initStats = () => {
  if (isLoaded.value && editor.value) {
    stats = new Stats(editor.value as Editor);
  }
};

const interval = setInterval(() => {
  if (!stats) {
    initStats();
    if (stats) clearInterval(interval);
  }
}, 500);


export {
    stats,
    isLoaded
};
