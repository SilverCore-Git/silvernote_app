import { computed } from 'vue';
import { editor as editorRef } from '../Editor';

export function useEditorStats
()
{
  
    const editor = editorRef.value;

    const characterCount = computed(() => {
        if (!editor) return 0;
        return editor.storage.characterCount?.characters() ?? 0;
    });

    const wordCount = computed(() => {
        if (!editor) return 0;
        return editor.storage.characterCount?.words() ?? 0;
    });

    return {
        characterCount,
        wordCount,
    };

}