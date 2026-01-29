import { computed, ref } from "vue";
import type { Tag, Note } from "../type";


const Tags = ref<Tag[]>([]);
const Notes = ref<Note[]>([]);
const sortedNotes = computed(() =>
  [...Notes.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
)
const SharedNotes = ref<Note[]>([]);
const ShareByMe = ref<Note[]>([]);


export {
    Notes,
    Tags,
    SharedNotes,
    sortedNotes,
    ShareByMe
}