<script setup lang="ts">

import { useRouter } from 'vue-router';
import { Notes } from '@/assets/ts/database/Var';
import { computed } from 'vue';
import PinnedNoteCard from '../common/PinnedNoteCard.vue';

const pinned_notes = computed(() =>
    Notes.value.filter(note => note.pinned)
)
const router = useRouter();

</script>

<template>

    <div 
        class="flex flex-col gap-4 "
    >

        <span class=" uppercase text-md font-semibold text-gray-500 ">
            <i class="bi bi-pin mr-1" />
            Notes épinglés
        </span>

        <ul
            class="
                grid grid-cols-3 gap-4
            "
        >
            <li
                v-for="note in pinned_notes"
                :key="note.id"
                @click="router.push('/edit/'+note.id)"
            >
                <PinnedNoteCard
                    :id="note.id"
                    :title="note.title"
                    :content="note.content"
                    :icon="note.icon"
                    :tags="note.tags"
                />
            </li>
        </ul>

    </div>

</template>
