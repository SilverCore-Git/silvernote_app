<script setup lang="ts">

import { sortedNotes, Tags } from '@/assets/ts/database/Var';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';
import useFilter from '../../composables/useFilter';
import { RecycleScroller } from 'vue3-virtual-scroller';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';

const { selectedFilter } = useFilter();
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

const notes = computed(() =>
    sortedNotes.value.filter(note => note.tags.includes(selectedFilter.value || 0))
);
const tag = computed(() =>
    Tags.value.filter(tag => tag.id === selectedFilter.value)[0]
);

const noteRows = computed(() => {

    const others = notes.value?.filter(n => !n.pinned) || [];
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
            v-else
            class="flex flex-col justify-center items-center absolute inset-0 -translate-y-20"
        >
            <i class="bi bi-search text-6xl mb-4 opacity-20"></i>
            <h3 class="text-2xl font-bold">Aucun résultat trouvé</h3>
        </div>

    </div>

</template>
