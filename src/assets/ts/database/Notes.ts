import { ref } from "vue";
import type { Note } from "../type";


const Notes = ref<Note[]>([]);


export {
    Notes
}