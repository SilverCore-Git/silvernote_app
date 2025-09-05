import { ref } from "vue";


type Notes_views_mode = 'tag' | 'default';

const notes_views_mode = ref<Notes_views_mode>('default');

const toggle_notes_views_mode = (state?: Notes_views_mode) => {
    if (state) return notes_views_mode.value = state;
    return notes_views_mode.value = notes_views_mode.value == 'default' ? 'tag' : 'default'; 
}


export {
    notes_views_mode,
    toggle_notes_views_mode
}