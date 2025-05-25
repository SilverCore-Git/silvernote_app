import { ref, computed, watch } from 'vue';

interface Note {
  id: number;
  pinned: boolean;
  title: string;
  content: string;
  date: string;
  tags: string[]
};

const list_notes_brut = ref<Note[]>([
  { id: 1, pinned: false, title: "Note 1", content: "Contenu de la note 1", date: "01 Janvier 2025", tags: ['perso'] },
  { id: 2, pinned: true, title: "Note 2", content: "Contenu de la note 2", date: "02 Janvier 2025", tags: ['perso'] },
  { id: 3, pinned: false, title: "Note 3", content: "Contenu de la note 3", date: "03 Janvier 2025", tags: ['perso'] },
  { id: 4, pinned: true, title: "Note 4", content: "Contenu de la note 4", date: "04 Janvier 2025", tags: ['perso'] },
  { id: 5, pinned: false, title: "Note 5", content: "Contenu de la note 5", date: "05 Janvier 2025", tags: ['perso'] },
  { id: 6, pinned: false, title: "Note 6", content: "Contenu de la note 6", date: "06 Janvier 2025", tags: ['perso'] },
  { id: 7, pinned: true, title: "Note 7", content: "Contenu de la note 7", date: "07 Janvier 2025", tags: ['perso'] },
  { id: 8, pinned: false, title: "Note 8", content: "Contenu de la note 8", date: "08 Janvier 2025", tags: ['perso'] },
  { id: 9, pinned: false, title: "Note 9", content: "Contenu de la note 9", date: "09 Janvier 2025", tags: ['perso'] },
  { id: 10, pinned: true, title: "Note 10", content: "Contenu de la note 10", date: "10 Janvier 2025", tags: ['ar'] },
  { id: 11, pinned: false, title: "Note 11", content: "Contenu de la note 11", date: "11 Janvier 2025", tags: ['ar'] },
  { id: 12, pinned: false, title: "Note 12", content: "Contenu de la note 12", date: "12 Janvier 2025", tags: ['ar'] },
  { id: 13, pinned: false, title: "Note 13", content: "Contenu de la note 13", date: "13 Janvier 2025", tags: ['ar'] },
  { id: 14, pinned: true, title: "Note 14", content: "Contenu de la note 14", date: "14 Janvier 2025", tags: ['perso'] },
  { id: 15, pinned: false, title: "Note 15", content: "Contenu de la note 15", date: "15 Janvier 2025", tags: ['pa'] },
  { id: 16, pinned: false, title: "Note 16", content: "Contenu de la note 16", date: "16 Janvier 2025", tags: ['pa'] },
  { id: 17, pinned: true, title: "Note 17", content: "Contenu de la note 17", date: "17 Janvier 2025", tags: ['pa'] },
  { id: 18, pinned: false, title: "Note 18", content: "Contenu de la note 18", date: "18 Janvier 2025", tags: ['pa'] },
  { id: 19, pinned: false, title: "Note 19", content: "Contenu de la note 19", date: "19 Janvier 2025", tags: ['perso'] },
  { id: 20, pinned: true, title: "Note 20", content: "Contenu de la note 20", date: "20 Janvier 2025", tags: ['d'] }
]);

const notes = computed<Note[]>(() => {
  let dd: Note[] = [...list_notes_brut.value].sort((a, b) => a.id - b.id);
  
  return dd.sort((a, b) => {
    if (a.pinned === b.pinned) {
      return a.id - b.id;
    }
    return a.pinned ? -1 : 1;
  });
});


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
    togglePinById,
    unpinNoteById,
    pinNoteById
}