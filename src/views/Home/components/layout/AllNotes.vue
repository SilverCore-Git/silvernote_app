<template>

  <div 
    class="min-h-full flex flex-col overflow-y-auto px-4 md:px-8" 
    v-if="Notes.length || pageQuery == 'shared'"
  >
    
    <template v-if="pageQuery === 'shared'">
      <SharedNotes />
    </template>

    <template v-else-if="searchQuery">
      <NotesByQuery />
    </template>

    <template v-else-if="isFilteredNotes">
      <FilteredNotes />
    </template>

    <template v-else>

      <div class="flex flex-col gap-8">
        
        <PinnedNotes v-if="hasPinnedNotes" />
        <OtherNotes v-if="hasNotPinnedNotes" />

      </div>

    </template>

  </div>

  <div 
    v-else 
    class="h-full flex flex-col items-center justify-center text-center -translate-y-25"
  >

    <div class="bg-(--white)/50 w-24 h-24 flex items-center justify-center rounded-3xl mb-6 animate-bounce-slow">
      <i class="bi bi-sticky text-5xl text-(--btn)" />
    </div>
    
    <h3 class="text-2xl font-bold">
      C'est bien vide ici...
    </h3>
    
    <p class="text-(--text-little) mt-2 max-w-[300px] leading-relaxed">
      Toutes vos grandes idées commencent par une simple note. Pourquoi ne pas en créer une maintenant ?
    </p>

    <button 
      @click="createNote"
      class="mt-8 premium xl gap-2"
    >
      <i class="bi bi-plus-lg" />
      Créer une note
    </button>

  </div>

</template>

<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { Notes } from '@/assets/ts/database/Var';
import useFilter from '../../composables/useFilter';

import PinnedNotes from '../Notes/PinnedNotes.vue';
import OtherNotes from '../Notes/OtherNotes.vue';
import SharedNotes from '../Notes/SharedNotes.vue';
import NotesByQuery from '../Notes/NotesByQuery.vue';
import FilteredNotes from '../Notes/FilteredNotes.vue';


const { selectedFilter } = useFilter();
const route = useRoute();
const router = useRouter();


const searchQuery = computed(() => (route.query.q ? String(route.query.q).trim() : ''));
const pageQuery = computed(() => (route.query.page ? String(route.query.page).trim() : ''));
const hasPinnedNotes = computed(() => Notes.value.some(note => note.pinned));
const isFilteredNotes = computed(() => selectedFilter.value)
const hasNotPinnedNotes = computed(() => Notes.value.some(note => !note.pinned));

const createNote = () => {
  router.push('/edit/new');
}

</script>
