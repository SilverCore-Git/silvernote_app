<script setup lang="ts">

import { sortedNotes } from '@/assets/ts/database/Var';
import { computed } from 'vue';
import { RecycleScroller } from 'vue3-virtual-scroller';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';

const noteRows = computed(() => {
    return (sortedNotes.value?.filter(n => !n.pinned) || []).map(n => ({
        ...n,
        id: n.uuid
    }));
});

</script>

<template>

    <div class="flex flex-col gap-4 shrink-0 w-full">
        
        <span class="uppercase text-md font-semibold text-(--text-little) px-1">
            Notes récentes
        </span>

        <RecycleScroller
            v-if="noteRows.length > 0"
            :key="'scroller-'+noteRows.length"
            :items="noteRows"
            :item-size="108" 
            key-field="id"
            :buffer="200" 
            page-mode
            class="w-full overflow-visible!"
        >

            <template #default="{ item: note }">
 

                    <DefaultNoteCard
                        :uuid="note.uuid"
                        :title="note.title"
                        :icon="note.icon"
                        :tags="note.tags"
                    />


            </template>

        </RecycleScroller>

        <div 
            v-if="sortedNotes.length > 16"
            class="mt-20 mb-40 flex flex-col items-center justify-center gap-4 group"
        >

            <div class="relative">

                <i class="bi bi-rocket-takeoff text-4xl text-(--btn) inline-block animate-bounce-slow group-hover:animate-rocket" />
                <div class="w-8 h-1 bg-(--text-little)/20 rounded-full blur-sm mx-auto mt-1 animate-pulse" />

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
                class="primary second mt-4"
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