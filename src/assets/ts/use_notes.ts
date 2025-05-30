
import { ref } from 'vue';

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


export {
    notes_parms
}