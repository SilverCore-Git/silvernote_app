<template>

  <div
    class="note-card bg-[#FFF8F0] text-[#3B3B3B]
           flex flex-col pl-4 pt-2.5 pb-2.5 border border-[#3B3B3B] z-30"
    style="box-shadow: 0 0 15px #3636364f; border-radius: 15px;"
  >

    <div class="flex flex-row items-center">

      <input 
        v-model="searchQuery"
        type="search" 
        class="w-[85%] border-none outline-none" 
        placeholder="Recherche..."
      >

      <button v-if="searchQuery !== ''" @click="searchQuery = ''" class="cross-btn absolute end-1"></button>
      <button v-if="searchQuery == ''" class="search-btn absolute end-4"></button>

    </div>

    <div v-if="filteredNotes.length && searchQuery != ''" class="mt-4 space-y-2 max-h-[55vh] relative overflow-x-auto pr-4">

      <div 
        v-for="note in filteredNotes" 
        :key="note.id"
        @click="router.push(`/edit?id=${note.id}&pinned=${note.pinned}`)"
        class="bg-white p-2 rounded shadow cursor-pointer "
      >
        <h3 
            class="font-semibold"
            v-html="highlightMatch(note.title, searchQuery)"
        ></h3>
        <p 
            class="text-sm max-h-20 text-gray-600 overflow-x-auto"
            v-html="highlightMatch(note.content, searchQuery)"
        ></p>

      </div>

    </div>

    <div v-if="searchQuery !== '' && !filteredNotes.length" class="text-sm text-gray-500 mt-4">
        Aucune note trouvée.
    </div>


  </div>

</template>



<script lang="ts" setup>

import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import db from '../assets/ts/database';

const router = useRouter();
const searchQuery = ref('');
const list_notes = ref<{
        id: number
        pinned: boolean
        simply_edit: boolean
        title: string
        content: string
        date: string
        tags: string[]
    }[]>([]);

const init_notes = async () => {
    list_notes.value = await db.getAll();
}

const filteredNotes = computed(() =>
  list_notes.value.filter((note) =>
    [note.title, note.content, ...(note.tags || [])]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
);

const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // échappe les regex
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300">$1</mark>');
};

onMounted(async () => {
  await init_notes();
});

</script>

<style scoped>

    .search-btn {

        cursor: pointer;
        width: 30px;
        height: 30px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../assets/svgs/magnifying-glass.svg');
        filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
        transition: all 0.3s ease;

    }

    .cross-btn {

        cursor: pointer;
        width: 55px;
        height: 55px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../assets/svgs/cross.svg');
        filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
        transition: all 0.3s ease;

    }

</style>