import { ref } from "vue";


type Notes_views_mode = 'tag' | 'default';
type Notes_filter = 'all' | 'pinned' | 'shared' | 'bin';

const notes_views_mode = ref<Notes_views_mode>('default');
const notes_filter = ref<Notes_filter>('all');

const toggle_notes_views_mode = (state?: Notes_views_mode) => {
    if (state) return notes_views_mode.value = state;
    return notes_views_mode.value = notes_views_mode.value == 'default' ? 'tag' : 'default'; 
}


export {
    notes_filter,
    notes_views_mode,
    toggle_notes_views_mode
}

export type {
    Notes_views_mode,
    Notes_filter
}