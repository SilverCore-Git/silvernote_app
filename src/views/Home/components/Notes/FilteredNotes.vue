<script setup lang="ts">

import { useRouter } from 'vue-router';
import { sortedNotes, Tags } from '@/assets/ts/database/Var';
import { computed } from 'vue';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';
import useFilter from '../../composables/useFilter';
import VirtualScroller from 'vue3-virtual-scroller';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';

const { selectedFilter } = useFilter();

const notes = computed(() =>
    sortedNotes.value.filter(note => note.tags.includes(selectedFilter.value || 0))
);
const tag = computed(() =>
    Tags.value.filter(tag => tag.id === selectedFilter.value)[0]
);
const router = useRouter();

</script>

<template>

    <div 
        class="flex flex-col gap-4 relative h-full"
    >

        <span
            class="
                uppercase text-md font-semibold text-(--text-little)
                 flex flex-row gap-2 justify-start items-center
            "
        >
            Notes taguées avec
            <div
                class="
                    border-2 rounded-full px-1.5 py-0.5
                    text-(--text-strong) text-sm font-semibold
                "
                :style="{
                    borderColor: tag.color
                }"
            >
                {{ tag.name }}
            </div>
        </span>

        <div
            v-if="notes.length"
            class="
                grid grid-cols-2
                gap-4
                h-full overflow-hidden
            "
        >
            <VirtualScroller
                :items="notes"
                :item-height="280"
                class="h-full"
                :buffer="5"
            >
                <template #default="{ item: note }">
                    <div 
                        class="overflow-hidden cursor-pointer"
                        @click="router.push('/edit/'+note.uuid)"
                    >
                        <DefaultNoteCard
                            :uuid="note.uuid"
                            :title="note.title"
                            :content="note.content"
                            :icon="note.icon"
                            :tags="note.tags"
                        />
                    </div>
                </template>
            </VirtualScroller>
        </div>

        <div
            v-else
            class="flex flex-col justify-center items-center absolute inset-0 -translate-y-20"
        >
            <i class="bi bi-search text-6xl mb-4 opacity-20"></i>
            <h3 class="text-2xl font-bold">Aucun résultat trouvé</h3>
        </div>

    </div>

</template>
