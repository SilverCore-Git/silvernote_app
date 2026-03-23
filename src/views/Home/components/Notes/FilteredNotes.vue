<script setup lang="ts">

import { sortedNotes, Tags } from '@/assets/ts/database/Var';
import { computed } from 'vue';
import { RecycleScroller } from 'vue3-virtual-scroller';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';
import useFilter from '../../composables/useFilter';

const { selectedFilter } = useFilter();

const noteRows = computed(() => {
    return (sortedNotes.value?.filter(n => n.tags.includes(selectedFilter.value)) || []).map(n => ({
        ...n,
        id: n.uuid
    }));
});

const tag = computed(() =>
    Tags.value.filter(tag => tag.id === selectedFilter.value)[0]
);

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
            :key="'scroller-'+noteRows.length"
            :items="noteRows"
            :item-size="108" 
            key-field="id"
            page-mode
            class="w-full overflow-visible!"
        >

            <template #default="{ item: note }">

                    <DefaultNoteCard
                        :key="note.uuid"
                        :uuid="note.uuid"
                        :title="note.title"
                        :icon="note.icon"
                        :tags="note.tags"
                    />
                    
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

<style scoped>

/* card scale hover */
:deep(.group:hover) {
    transform: scale(1.02) !important;
    z-index: 30;
    border-color: var(--btn) !important;
    opacity: 1 !important;
}

:deep(.vue-recycle-scroller__item-view:has(+ .vue-recycle-scroller__item-view .group:hover) .group) {
    transform: scale(1.01);
    opacity: 0.92;
    z-index: 10;
}

:deep(.vue-recycle-scroller__item-view:has(.group:hover) + .vue-recycle-scroller__item-view .group) {
    transform: scale(1.01);
    opacity: 0.92;
    z-index: 10;
}

:deep(.group) {
    transition: 
        transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), 
        border-color 0.3s ease, 
        opacity 0.4s ease !important;
    will-change: transform;
}

:deep(.vue-recycle-scroller__item-wrapper) {
    overflow: visible !important;
    padding-top: 4px;
    padding-bottom: 4px;
}

:deep(.vue-recycle-scroller__item-view) {
    overflow: visible !important;
    transition: z-index 0s;
}


</style>