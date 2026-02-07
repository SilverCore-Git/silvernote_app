<template>

  <div 
    class="min-h-full flex flex-col overflow-y-auto custom-scroll" 
    v-if="Notes.length || pageQuery == 'shared'"
  >
    
    <template v-if="pageQuery === 'shared'">
      <SharedNotes />
    </template>

    <template v-else-if="searchQuery">
      <NotesByQuery />
    </template>

    <template v-else>
      <div class="flex flex-col gap-8">
        <PinnedNotes v-if="hasPinnedNotes" />
        
        <OtherNotes v-if="hasNotPinnedNotes" />
      </div>
    </template>

  </div>

</template>

<script setup lang="ts">

import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { Notes } from '@/assets/ts/database/Var';
import PinnedNotes from '../Notes/PinnedNotes.vue';
import OtherNotes from '../Notes/OtherNotes.vue';
import SharedNotes from '../Notes/SharedNotes.vue';
import NotesByQuery from '../Notes/NotesByQuery.vue';

const route = useRoute();
const searchQuery = computed(() => (route.query.q ? String(route.query.q).trim() : ''));
const pageQuery = computed(() => (route.query.page ? String(route.query.page).trim() : ''));
const hasPinnedNotes = computed(() => Notes.value.some(note => note.pinned));
const hasNotPinnedNotes = computed(() => Notes.value.some(note => !note.pinned));

</script>


<style scoped>
.custom-scroll {
    height: 100%;
}
</style>