import { Editor } from "@tiptap/vue-3";
import { ref, watch } from "vue";

const isLoaded = ref<boolean>(false);
const editor = ref<Editor | undefined>(undefined);

watch(() => editor.value, () => {
    if (editor !== undefined) isLoaded.value = true;
})

export {
    isLoaded,
    editor
}