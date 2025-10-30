<template>

  <div
    class="note-card bg-[var(--bg2)] text-[var(--text)] 
            border z-30 rounded-xl
          relative lg:mx-0 mx-4 w-full flex flex-col py-2 px-3"
    :class="isFocus ? 'border-[var(--btn)]' : 'border-[var(--text-little)]'"
    style="box-shadow: 0 0 5px #3636364f;"
    
  >

    <div class="flex flex-row justify-center items-center">

      <button @click="search_input?.focus()" class="search-btn absolute left-0"></button>

      <input 
        ref="search_input"
        @focus="isFocus = true"
        @blur="isFocus = false"
        v-model="searchQuery"
        type="text"
        class="w-full border-none outline-none text-md ml-2" 
        placeholder="Recherche..."
      >

    </div>

    <div 
      v-if="searchQuery !== '' && !filteredNotes.length" 
      class="text-sm "
    >
        Aucune note trouvée.
    </div>

    <div class="absolute top-2 inset-x-0 z-50">

      <div 
          v-if="filteredNotes.length && searchQuery != '' && isFocus" 
          class="space-y-2 w-full overflow-x-auto p-3 absolute top-10 h-[90vh]
                  bg-[var(--bg2)] rounded-xl border border-[var(--text-little)]"
      >

        <MasonryWrapper class="w-full">
        
          <MasonryItem
            v-for="note in filteredNotes" 
          >

            <Note_card 
              :key="note.id"
              :id="note.id"
              :icon="note.icon"
              :uuid="note.uuid"
              :pinned="note.pinned"
              :title="highlightMatch(utils.htmlToText(note.title), searchQuery)" 
              :content="highlightMatch(utils.htmlToText(note.content), searchQuery)"
              :clean-HTML="false" 
              :date="note.date"
              :tags="note.tags.map(tag => Number(tag))"
            />

          </MasonryItem>

        </MasonryWrapper>

      </div>

    </div>

  </div>

</template>



<script lang="ts" setup>

import { computed, onMounted, ref } from 'vue';

import db from '@/assets/ts/database/database';
import type { Note, Tag } from '@/assets/ts/type';
import utils from '@/assets/ts/utils';
import Note_card from '@/components/notes/Note_card.vue';
import MasonryWrapper from '@/components/Masonry/MasonryWrapper.vue';
import MasonryItem from '@/components/Masonry/MasonryItem.vue';

defineProps<{
  desktop?: boolean;
}>()

const search_input = ref<HTMLInputElement | null>(null);
const isFocus = ref<boolean>(false);

const searchQuery = ref('');
const list_notes = ref<Note[]>([]);
const all_tags = ref<Tag[]>([]);

onMounted(async () => {
  all_tags.value = await db.getAll('tags');
})

const init_notes = async () => {
    list_notes.value = await db.getAll('notes');
    list_notes.value.sort( (a, b) => { return b.id - a.id } );
}

const filteredNotes = computed(() =>

  list_notes.value.filter(note => {
    const tagNames = all_tags.value
      .filter(tag => note.tags.includes(tag.id))
      .map(tag => tag.name)
      .join(' ');

    const searchableText = [note.title, note.content, tagNames, ...(note.tags || [])]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(searchQuery.value.toLowerCase());
  })

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
        width: 20px;
        height: 20px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../assets/svgs/magnifying-glass.svg');
        filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
        transition: all 0.3s ease;

    }

    .cross-btn {

        cursor: pointer;
        width: 25px;
        height: 25px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../assets/svgs/cross.svg');
        filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
        transition: all 0.3s ease;

    }

</style>