<script setup lang="ts">

import { useRouter } from 'vue-router';
import { Notes } from '@/assets/ts/database/Var';
import { computed } from 'vue';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';
import useFilter from '../../composables/useFilter';

const { selectedFilter } = useFilter();

const notes = computed(() =>
    Notes.value.filter(note => note.tags.includes(selectedFilter.value || 0))
)
const router = useRouter();

</script>

<template>

    <div 
        class="flex flex-col gap-4 relative h-full"
    >

        <span class=" uppercase text-md font-semibold text-(--text-little) ">
            Notes filtrées
        </span>

        <ul
            v-if="notes.length"
            class="
                sm:flex sm:flex-wrap
                grid grid-cols-2
                gap-4
            "
        >
            <li
                v-for="(note, index) in notes"
                :key="index"
                @click="router.push('/edit/'+note.uuid)"
                class="sm:max-w-[250px]"
            >
                <DefaultNoteCard
                    :uuid="note.uuid"
                    :title="note.title"
                    :content="note.content"
                    :icon="note.icon"
                    :tags="note.tags"
                />
            </li>
        </ul>

        <div
            v-else
            class="flex flex-col justify-center items-center absolute inset-0 -translate-y-20"
        >
            <i class="bi bi-search text-6xl mb-4 opacity-20"></i>
            <h3 class="text-2xl font-bold">Aucun résultat trouvé</h3>
        </div>

    </div>

</template>
