import { ref } from "vue";


const selectedNotes = ref<string[]>([]); // note uuid list


const toggleNoteSelect = (uuid: string) => {
    if (selectedNotes.value.includes(uuid)) {
        selectedNotes.value = selectedNotes.value.filter((id) => id !== uuid);
    } else {
        selectedNotes.value.push(uuid);
    }
}


const clearSelectedNotes = () => {
    selectedNotes.value = [];
}

const isSelected = (uuid: string): boolean => {
    return selectedNotes.value.includes(uuid);
}


export {
    selectedNotes,
    toggleNoteSelect,
    clearSelectedNotes,
    isSelected
}

