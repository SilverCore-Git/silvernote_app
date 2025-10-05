import { Editor } from "@tiptap/vue-3";
import { ref, type Ref } from "vue";

interface EditorState {
  editor: Ref<Editor | undefined>;
  isLoaded: Ref<boolean>;
}

export function createEditorState(): EditorState {
  const editor = ref<Editor | undefined>(undefined);
  const isLoaded = ref<boolean>(false);

  return {
    editor,
    isLoaded
  };
}