<template>

  <div
    :class="desktop && filteredNotes.length && searchQuery != '' 
            ? 'note-card bg-[var(--bg2)] text-[var(--text)] absolute right-4 left-4  flex flex-col pl-4 pt-2.5 pb-2.5 border border-[var(--text)] z-30'
            : 'note-card bg-[var(--bg2)] text-[var(--text)] relative lg:ml-0 ml-4 mr-4 w-full flex flex-col pl-4 pt-2.5 pb-2.5 border border-[var(--text)] z-30'"
    style="box-shadow: 0 0 15px #3636364f; border-radius: var(--br-btn);"
    :style="desktop && filteredNotes.length && searchQuery != '' 
            ? { top: `calc(4.5rem + ${props.pt})` } 
            : ''"
  >

    <div class="flex flex-row items-center">

      <input 
        ref="search_input"
        v-model="searchQuery"
        type="text"
        class="w-[85%] border-none outline-none" 
        placeholder="Recherche..."
      >

      <button v-if="searchQuery !== ''" @click="searchQuery = ''" class="cross-btn absolute end-1" :class="hitbox ? 'bg-red-600' : ''"></button>
      <button v-if="searchQuery == ''" @click="search_input?.focus()" class="search-btn absolute end-4" :class="hitbox ? 'bg-red-600' : ''"></button>

    </div>

    <div 
        v-if="filteredNotes.length && searchQuery != '' && !desktop" 
        class="mt-4 space-y-2 w-[100%] relative overflow-x-auto pr-4" 
        :style="{ maxHeight: `calc(100vh - 3.5rem - ${props.pt} - 5.3rem)`, minHeight: `calc(100vh - 3.5rem - ${props.pt} - 5.3rem)` }"
    >

      <div 
        v-for="note in filteredNotes" 
        :key="note.id"
        @click="router.push(`/edit?id=${note.id}&pinned=${note.pinned}`)"
        class="bg-[var(--bg2)] p-2 rounded shadow cursor-pointer border-1 border-[var(--text)]"
      >
        <h3 
            class="font-semibold"
            v-html="highlightMatch(utils.clean_html(note.title), searchQuery)"
        ></h3>
        <p 
            class="text-sm max-h-20 overflow-hidden"
            v-html="highlightMatch(utils.clean_html(note.content), searchQuery)"
        ></p>

      </div>

    </div>

    <div v-if="searchQuery !== '' && !filteredNotes.length" class="text-sm mt-4">
        Aucune note trouvée.
    </div>

  
    <ul 
        v-else-if="filteredNotes.length && searchQuery != '' && desktop" 
        class="mt-4 space-y-2 w-full relative overflow-x-auto gap-4
              pr-4 grid lg:grid-cols-[23%_23%_23%_23%] xl:grid-cols-[18%_18%_18%_18%_18%] " 
        :style="{ maxHeight: `calc(100vh - 3.5rem - ${props.pt} - 5.3rem)`,  minHeight: `calc(80vh - 3.5rem - ${props.pt})` }"
    >

      <li 
        v-for="note in filteredNotes" 
        :key="note.id"
        @click="router.push(`/edit?id=${note.id}&pinned=${note.pinned}`)"
        class="bg-[var(--bg2)] p-3 rounded-[15px] shadow cursor-pointer relative h-fullborder-[var(--text)]"
      >

          <h3 
              class="font-semibold"
              v-html="highlightMatch(utils.clean_html(note.title), searchQuery)"
              :class="hitbox ? 'bg-blue-200' : ''"
          ></h3>
          <p 
              class="text-sm overflow-hidden mb-5"
              v-html="highlightMatch(utils.clean_html(note.content), searchQuery)"
              :class="hitbox ? 'bg-blue-500' : ''"
          ></p>

          <div class="absolute left-1 bottom-1 w-[60%] whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none">
            <div 
                v-for="(tag) in all_tags.filter(tag => note.tags.includes(tag.id))" 
                :key="tag.id" 
                class="ml-2 underline" 
                :class="hitbox ? 'bg-teal-500' : ''"
                v-html="highlightMatch(tag.name, searchQuery)"
            ></div>
          </div>

          <label class="absolute right-2.5 bottom-1.5 z-10" :class="hitbox ? 'bg-teal-500' : ''">{{ note.date }}</label>
          
        </li>

      </ul>

  </div>

</template>



<script lang="ts" setup>

import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import db from '../assets/ts/database';
import type { Note, Tag } from '../assets/ts/type';
import { hitbox as if_hitbox } from '../assets/ts/settings';
import utils from '../assets/ts/utils';

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