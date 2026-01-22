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

        <span class=" uppercase text-md font-semibold text-(--text-little) ">
            <i class="bi bi-pin mr-1" />
            Notes épinglés
        </span>

        <ul
            class="
                grid gap-4
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
            "
        >
            <li
                v-for="(note, index) in pinned_notes"
                :key="index"
                @click="router.push('/edit/'+note.uuid)"
            >
                <PinnedNoteCard
                    :uuid="note.uuid"
                    :title="note.title"
                    :content="note.content"
                    :icon="note.icon"
                    :tags="note.tags"
                />
            </li>
        </ul>

    </div>

</template>
