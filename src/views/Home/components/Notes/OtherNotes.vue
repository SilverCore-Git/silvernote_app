<script setup lang="ts">

import { sortedNotes } from '@/assets/ts/database/Var';
import { computed } from 'vue';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';

const notes = computed(() =>
    sortedNotes.value.filter(note => !note.pinned)
)

</script>

<template>

    <div 
        class="flex flex-col gap-4 "
    >

        <span class=" uppercase text-md font-semibold text-(--text-little) ">
            Notes récentes
        </span>

        <ul
            class="
                sm:flex sm:flex-wrap
                grid grid-cols-2
                gap-4
            "
        >
            <li
                v-for="(note, index) in notes"
                :key="index"
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

    </div>

</template>
