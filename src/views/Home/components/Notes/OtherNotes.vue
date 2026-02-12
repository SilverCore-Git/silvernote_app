<script setup lang="ts">

import { Notes, sortedNotes } from '@/assets/ts/database/Var';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { RecycleScroller } from 'vue3-virtual-scroller';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';


const columns = ref<number>(3);
const updateColumns = () => {
    if (window.innerWidth < 1024) columns.value = 2;
    else if (window.innerWidth < 1400) columns.value = 3;
    else if (window.innerWidth < 1800) columns.value = 4;
    else if (window.innerWidth < 2000) columns.value = 5;
    else columns.value = 6;
};

onMounted(() => {
    updateColumns();
    window.addEventListener('resize', updateColumns);
});
onUnmounted(() => window.removeEventListener('resize', updateColumns));

const noteRows = computed(() => {

    const others = sortedNotes.value?.filter(n => !n.pinned) || [];
    const rows = [];
    const colCount = columns.value || 1;

    for (let i = 0; i < others.length; i += colCount)
    {
    
        const rowItems = others.slice(i, i + colCount);
        
        if (rowItems.length > 0)
        {
            rows.push({
                id: `row-${rowItems[0].uuid}`,
                items: [...rowItems] 
            });
        }

    }

    return rows;

});

</script>

<template>

    <div class="flex flex-col w-full pb-100">
    
        <span class="uppercase text-md font-semibold text-(--text-little) mb-4 shrink-0 px-1">
            Notes récentes
        </span>

        <RecycleScroller
            v-if="noteRows.length > 0"
            :key="noteRows.length"
            :items="noteRows"
            :item-size="220"
            key-field="id"
            page-mode
            class="w-full"
            :buffer="600" 
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

        <div 
            v-if="Notes.length > 16"
            class="mt-40 flex flex-col items-center justify-center gap-4 group"
        >
            
            <div class="relative">
                <i class="bi bi-rocket-takeoff text-4xl text-(--btn) inline-block animate-bounce-slow group-hover:animate-rocket"></i>
                <div class="w-8 h-1 bg-(--text-little)/20 rounded-full blur-sm mx-auto mt-1 animate-pulse"></div>
            </div>

            <div class="text-center">
                <h3 class="text-2xl font-black ">
                    T'es allé au bout du game !
                </h3>
                <p class="text-(--text-little) text-sm font-medium opacity-60">
                    C'est tout pour le moment. Repose ton pouce, il a bien bossé.
                </p>
            </div>

            <button 
                @click="(e: any) => e.currentTarget.closest('.overflow-y-auto').scrollTo({ top: 0, behavior: 'smooth' })"
                class="primary second"
            >
                REMONTER
            </button>

        </div>
    
    </div>

</template>

<style scoped>

@keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

@keyframes rocket {
    0% { transform: translateY(0) scale(1); }
    30% { transform: translateY(5px) scale(1.1); }
    100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
}

.animate-bounce-slow {
    animation: bounce-slow 3s infinite ease-in-out;
}

</style>