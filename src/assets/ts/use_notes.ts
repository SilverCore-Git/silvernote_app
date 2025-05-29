
import { ref, computed, watch } from 'vue';
import Notes_json from '../notes.json';

interface Note {
  id: number
  pinned: boolean
  simply_edit: boolean
  title: string
  content: string
  date: string
  tags: string[]
};

const list_notes_brut = ref<Note[]>( Notes_json );

interface Notes_parms {
  tags: { id: number, name: string, active: boolean }[]
};

const notes_parms = ref<Notes_parms>({
  tags: [
    { id: 1, name: "perso", active: false },
    { id: 2, name: "ar", active: false },
    { id: 3, name: "pa", active: false },
    { id: 4, name: "d", active: false }
  ]
});

const notes = computed<Note[]>(() => {
  let dd: Note[] = [...list_notes_brut.value].sort((a, b) => a.id - b.id);
  
  return dd.sort((a, b) => {
    if (a.pinned === b.pinned) {
      return a.id - b.id;
    }
    return a.pinned ? -1 : 1;
  });
});

const get_note = (id: number): Note | undefined => {
  return list_notes_brut.value.find(note => note.id === id);
};

const filteredNotes = ref<Note[]>(notes.value);

const add_tag_filter = (id: number) => {

  notes_parms.value.tags[id].active = !notes_parms.value.tags[id].active;

  const activeTags = notes_parms.value.tags
    .filter(tag => tag.active)
    .map(tag => tag.name);

  if (activeTags.length === 0) {
    filteredNotes.value = notes.value;
  } else {
    filteredNotes.value = notes.value.filter(note =>
      note.tags.some(tag => activeTags.includes(tag))
    );
  }
};


const togglePinById = (id: number) => {
  const note = list_notes_brut.value.find(note => note.id === id);
  if (note) note.pinned = !note.pinned;
};

const unpinNoteById = (id: number) => {
  const note = list_notes_brut.value.find(note => note.id === id);
  if (note) {
    note.pinned = false;
  }
};

const pinNoteById = (id: number) => {
  const note = list_notes_brut.value.find(note => note.id === id);
  if (note) {
    note.pinned = true;
  }
};


let list_notes: Note[] = notes.value;

watch(list_notes_brut, () => {
  list_notes = notes.value;
  console.log("Les notes ont été modifiées, tri en cours...");
}, { deep: true });

export {
    list_notes,
    notes_parms,
    filteredNotes,
    togglePinById,
    unpinNoteById,
    add_tag_filter,
    get_note,
    pinNoteById
}