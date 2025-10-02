<template>

  <div
    class="note-card bg-[var(--bg2)] text-[var(--text)] border border-[var(--text)] z-30 rounded-2xl py-1.5
          relative lg:mx-0 mx-4 w-full flex flex-col pl-4"
    style="box-shadow: 0 0 15px #3636364f;"
    
  >

    <div class="flex flex-row items-center">

      <input 
        ref="search_input"
        v-model="searchQuery"
        type="text"
        class="w-[85%] border-none outline-none" 
        placeholder="Recherche..."
      >

      <button v-if="searchQuery !== ''" @click="searchQuery = ''" class="cross-btn absolute end-1"></button>
      <button v-if="searchQuery == ''" @click="search_input?.focus()" class="search-btn absolute end-4"></button>

    </div>

    <div 
      v-if="searchQuery !== '' && !filteredNotes.length" 
      class="text-sm "
    >
        Aucune note trouvée.
    </div>

  </div>

  <div class="absolute top-0 inset-x-0 z-50 md:w-2/5">

    <div 
        v-if="filteredNotes.length && searchQuery != ''" 
        class="space-y-2 w-full overflow-x-auto p-2 absolute top-11 bg-[var(--bg2)] rounded-2xl border border-[var(--text)]" 
        :style="{ maxHeight: `calc(100vh - 3.5rem - ${props.pt} - 5.3rem)`, minHeight: `calc(100vh - 3.5rem - ${props.pt} - 5.3rem)` }"
    >

      <div 
        v-for="note in filteredNotes" 
        :key="note.id"
        @click="router.push(`/edit/${note.id}?pinned=${note.pinned}`)"
        class="bg-[var(--bg2)] p-2 shadow cursor-pointer border-1 border-[var(--text)]"
        style="border-radius: var(--br-card);"
      >
        <h3 
            class="font-semibold"
            v-html="highlightMatch(utils.clean_html(note.title), searchQuery)"
        ></h3>

        <p 
            class="text-sm max-h-20 overflow-hidden mb-3"
            v-html="highlightMatch(utils.clean_html(note.content), searchQuery)"
        ></p>

        <div class="w-full flex flex-row justify-start items-center
          overflow-scroll whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none">

          <div 
            v-for="(tag, index) in all_tags.filter(tag => note.tags.includes(tag.id))" 
            :key="index" 
            class="ml-2 border-1 border-[var(--text)] pr-1.5 pl-1.5 rounded-[var(--br-tag)]" 
            :style="{ backgroundColor: tag.color, color: utils.get_text_color(tag.color) }" 
            :class="hitbox ? 'bg-teal-500' : ''"
            v-html="highlightMatch(utils.clean_html(tag.name), searchQuery)"
          ></div>

        </div>

      </div>

    </div>

  </div>

</template>



<script lang="ts" setup>

import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import db from '@/assets/ts/database/database';
import type { Note, Tag } from '@/assets/ts/type';
import { hitbox as if_hitbox } from '@/assets/ts/settings';
import utils from '@/assets/ts/utils';

let hitbox: boolean;
onMounted(async () => { hitbox = await if_hitbox() })

const props = defineProps<{
  pt?: string;
  desktop?: boolean;
}>()

const search_input = ref<HTMLInputElement | null>(null);

const router = useRouter();
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
        width: 25px;
        height: 25px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../assets/svgs/magnifying-glass.svg');
        filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
        transition: all 0.3s ease;

    }

    .cross-btn {

        cursor: pointer;
        width: 35px;
        height: 35px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../assets/svgs/cross.svg');
        filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
        transition: all 0.3s ease;

    }

</style>