import { ref } from "vue";
import type { Tag, Note } from "../type";


const Tags = ref<Tag[]>([]);
const Notes = ref<Note[]>([]);
const SharedNotes = ref<Note[]>([]);


export {
    Notes,
    Tags,
    SharedNotes
}