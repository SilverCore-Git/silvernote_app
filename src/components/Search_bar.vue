<template>

  <div
    class="note-card bg-[#FFF8F0] mr-4 ml-4 text-[#3B3B3B]
           flex flex-col p-4 border border-[#3B3B3B] relative"
    style="box-shadow: 0 0 15px #3636364f; border-radius: 15px;"
  >

    <div class="flex flex-row items-center">
      <input 
        v-model="searchQuery"
        type="search" 
        class="w-[85%] border-none outline-none" 
        placeholder="Recherche..."
      >
      <button type="submit" class="search-btn absolute end-3"></button>
    </div>

    <div v-if="filteredNotes.length && searchQuery != ''" class="mt-4 space-y-2">
      <div 
        v-for="note in filteredNotes" 
        :key="note.id"
        class="bg-white p-2 rounded shadow"
      >
        <h3 class="font-semibold">{{ note.title }}</h3>
        <p class="text-sm text-gray-600">{{ note.content }}</p>
      </div>
    </div>

    <div v-if="searchQuery !== '' && !filteredNotes.length" class="text-sm text-gray-500 mt-4">
        Aucune note trouvée.
    </div>


  </div>

</template>



<script lang="ts" setup>

import { computed, ref } from 'vue';

import { list_notes } from '../assets/ts/use_notes';

const searchQuery = ref('')

const filteredNotes = computed(() =>
  list_notes.filter((note) =>
    [note.title, note.content, ...(note.tags || [])]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
);

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

</style>