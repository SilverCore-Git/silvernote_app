import { Editor } from "@tiptap/vue-3";
import { ref } from "vue";


const editor = ref<Editor | undefined>(undefined);
const isLoaded = ref<boolean>(false);


export {
  editor,
  isLoaded
}
