import { computed } from 'vue';
import { editor } from '../Editor';

export function useEditorStats
()
{

    const characterCount = computed(() => {
        if (!editor.value) return 0;
        return editor.value.storage.characterCount?.characters() ?? 0;
    });

    const wordCount = computed(() => {
        if (!editor.value) return 0;
        return editor.value.storage.characterCount?.words() ?? 0;
    });

    return {
        characterCount,
        wordCount,
    };

}