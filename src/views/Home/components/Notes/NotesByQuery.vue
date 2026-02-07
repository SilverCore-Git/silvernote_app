<script setup lang="ts">

import { useRoute } from 'vue-router';
import { sortedNotes } from '@/assets/ts/database/Var';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { RecycleScroller } from 'vue3-virtual-scroller';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';

const route = useRoute();


const columns = ref<number>(3);
const updateColumns = () => {
    if (window.innerWidth < 640) columns.value = 1;
    else if (window.innerWidth < 1024) columns.value = 2;
    else columns.value = 3;
};

onMounted(() => {
    updateColumns();
    window.addEventListener('resize', updateColumns);
});
onUnmounted(() => window.removeEventListener('resize', updateColumns));


const filteredNotes = computed(() => {
    const searchQuery = route.query.q ? String(route.query.q).toLowerCase().trim() : '';
    if (!searchQuery) return sortedNotes.value;

    return sortedNotes.value.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(searchQuery);
        const contentMatch = note.content.toLowerCase().includes(searchQuery);
        return titleMatch || contentMatch;
    });
});


const noteRows = computed(() => {
    const rows = [];
    const notes = filteredNotes.value;
    for (let i = 0; i < notes.length; i += columns.value) {
        const rowItems = notes.slice(i, i + columns.value);
        rows.push({
            id: rowItems[0].uuid, // ID stable pour le recyclage
            items: rowItems
        });
    }
    return rows;
});

</script>

<template>

    <div class="flex flex-col gap-4 h-full">
        
        <span class="uppercase text-md font-semibold text-(--text-little) shrink-0">
            Résultats de recherche ({{ filteredNotes.length }})
        </span>

        <div v-if="filteredNotes.length" class="flex-1 ">

            <RecycleScroller
                :items="noteRows"
                :item-size="220"
                key-field="id"
                page-mode
                class="w-full"
                :buffer="2000"
            >
                <template #default="{ item: row }">
                    <div 
                        class="grid gap-4 mb-4 pr-2 pl-1"
                        :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
                    >
                        <div v-for="note in row.items" :key="note.uuid">
                            <DefaultNoteCard
                                :uuid="note.uuid"
                                :title="note.title"
                                :content="note.content"
                                :icon="note.icon"
                                :tags="note.tags"
                            />
                        </div>
                    </div>
                </template>
            </RecycleScroller>

            <div class="mt-60 mb-100 flex flex-col items-center justify-center gap-4 group">
                
                <div class="relative">
                    <i class="bi bi-check2-circle text-4xl text-(--btn) opacity-50"></i>
                </div>

                <div class="text-center">
                    <h3 class="text-2xl font-black ">
                        C'est tout ce qu'on a trouvé !
                    </h3>
                </div>

                <button 
                    @click="(e: any) => e.currentTarget.closest('.overflow-y-auto').scrollTo({ top: 0, behavior: 'smooth' })"
                    class="primary second"
                >
                    REMONTER
                </button>

            </div>

        </div>

        <div
            v-else
            class="flex flex-col justify-center items-center py-20 opacity-30"
        >
            <i class="bi bi-search text-6xl mb-4"></i>
            <h3 class="text-2xl font-bold">Aucun résultat</h3>
            <p class="text-sm">On a fouillé partout, mais rien pour "{{ route.query.q }}"</p>
        </div>

    </div>

</template>