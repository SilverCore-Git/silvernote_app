import { computed, ref } from "vue";
import type { Tag, Note } from "../type";


const Tags = ref<Tag[]>([]);
const Notes = ref<Note[]>([]);
const sortedNotes = computed(() =>

  [...Notes.value].sort((a, b) => {

    const lastA = a.lastSaveAt ? new Date(a.lastSaveAt).getTime() : 0
    const lastB = b.lastSaveAt ? new Date(b.lastSaveAt).getTime() : 0

    if (lastA !== lastB) {
      return lastB - lastA
    }

    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()

    return dateB - dateA

  })
  
)

const SharedNotes = ref<Note[]>([]);
const ShareByMe = ref<Note[]>([]);
const ShareByMeShare = ref<any[]>([]);


export {
    Notes,
    Tags,
    SharedNotes,
    sortedNotes,
    ShareByMe,
    ShareByMeShare
}