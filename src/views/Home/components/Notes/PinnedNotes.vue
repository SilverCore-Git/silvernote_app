<script setup lang="ts">
import { useRouter } from 'vue-router';
import { sortedNotes } from '@/assets/ts/database/Var';
import { computed } from 'vue';
import PinnedNoteCard from '../common/PinnedNoteCard.vue';

const pinned_notes = computed(() =>
    sortedNotes.value.filter(note => note.pinned)
)
const router = useRouter();
</script>

<template>
    <div v-if="pinned_notes.length" class="flex flex-col gap-4 shrink-0">

        <span class="uppercase text-md font-semibold text-(--text-little) flex items-center">
            <i class="bi bi-pin-fill mr-2 text-orange-400" />
            Notes épinglées
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
                v-for="note in pinned_notes"
                :key="note.uuid"
                @click="router.push('/edit/'+note.uuid)"
                class="cursor-pointer"
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