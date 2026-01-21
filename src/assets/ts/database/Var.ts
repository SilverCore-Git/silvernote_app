import { ref } from "vue";
import type { Tag, Note } from "../type";
import parseFrenchDate from "../utils/parseFrenchDate";


const Tags = ref<Tag[]>([]);
const Notes = ref<Note[]>([]);
const SharedNotes = ref<Note[]>([]);


function sortNotes() {
    Notes.value.sort((a, b) => {
        return parseFrenchDate(b.date) - parseFrenchDate(a.date);
    });
}


export {
    Notes,
    Tags,
    SharedNotes,
    sortNotes
}