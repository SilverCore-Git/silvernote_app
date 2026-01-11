<script setup lang="ts">

import { useRouter } from 'vue-router';
import { Notes } from '@/assets/ts/database/Var';
import { computed } from 'vue';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';

const notes = computed(() =>
    Notes.value.filter(note => !note.pinned)
)
const router = useRouter();

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
                flex flex-wrap gap-4
            "
        >
            <li
                v-for="(note, index) in notes"
                :key="index"
                @click="router.push('/edit/'+note.uuid)"
                class="w-[250px]"
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
