<script setup lang="ts">

import { sortedNotes } from '@/assets/ts/database/Var';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { RecycleScroller } from 'vue3-virtual-scroller';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';

const windowWidth = ref(window.innerWidth);
const updateWidth = () => windowWidth.value = window.innerWidth;

onMounted(() => window.addEventListener('resize', updateWidth));
onUnmounted(() => window.removeEventListener('resize', updateWidth));

const gridCols = computed(() => {
    if (windowWidth.value >= 1024) return 3;
    if (windowWidth.value >= 640) return 2;
    return 1;
});

const noteRows = computed(() => {
    const notes = sortedNotes.value?.filter(n => !n.pinned) || [];
    const cols = gridCols.value;
    const rows = [];
    for (let i = 0; i < notes.length; i += cols) {
        rows.push({
            id: 'row-' + i,
            items: notes.slice(i, i + cols)
        });
    }
    return rows;
});

</script>

<template>

    <div class="flex flex-col gap-4 shrink-0 w-full">

        <span class="uppercase text-md font-semibold text-(--text-little) px-1">
            Notes récentes
        </span>

        <RecycleScroller
            v-if="noteRows.length > 0"
            :key="'scroller-' + gridCols + '-' + noteRows.length"
            :items="noteRows"
            :item-size="108" 
            key-field="id"
            page-mode
            class="w-full overflow-visible!"
        >

            <template #default="{ item: row }">

                <div 
                    class="grid gap-4 px-1" 
                    :style="{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }"
                >

                    <DefaultNoteCard
                        v-for="note in row.items"
                        :key="note.uuid"
                        :uuid="note.uuid"
                        :title="note.title"
                        :icon="note.icon"
                        :tags="note.tags"
                    />
                </div>

            </template>

        </RecycleScroller>

        <div v-if="sortedNotes.length > 16" class="mt-20 mb-40 flex flex-col items-center justify-center gap-4 group">

            <div class="relative">
                <i class="bi bi-rocket-takeoff text-4xl text-(--btn) inline-block animate-bounce-slow group-hover:animate-rocket" />
                <div class="w-8 h-1 bg-(--text-little)/20 rounded-full blur-sm mx-auto mt-1 animate-pulse" />
            </div>

            <div class="text-center">
                <h3 class="text-2xl font-black ">T'es allé au bout du game !</h3>
                <p class="text-(--text-little) text-sm font-medium opacity-60">C'est tout pour le moment. Repose ton pouce, il a bien bossé.</p>
            </div> 

            <button @click="(e: any) => e.currentTarget.closest('.overflow-y-auto').scrollTo({ top: 0, behavior: 'smooth' })" class="primary second mt-4">
                REMONTER
            </button>

        </div>

    </div>

</template>
