<template>

    <SearchANote
        v-if="searchNote"
        @close="searchNote = false"
        @note="openNote"
    />


</template>

<script lang="ts" setup>
import SearchANote from './notes/searchANote.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const searchNote = ref<boolean>(false);


const openNote = (id: number) => {
    window.open('/edit/' + id);
    searchNote.value = false;
}



function handleShortcut(e: KeyboardEvent) {

    const target = e.target as HTMLElement;
    if (["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable) {
        return;
    }

    // Ctrl + f => ouvrir recherche de notes
    if (e.ctrlKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchNote.value = true;
    }
}


onMounted(() => {
  window.addEventListener("keydown", handleShortcut);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleShortcut);
});

</script>