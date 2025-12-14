<template>

    <a @click="emit('close')">
        <i class="text-3xl bi bi-x p-1" />
    </a>

    <div 
        class="
                flex gap-4 justify-center items-center
                text-2xl 
            "
    >
                    
        <a
            class="bi p-1"
            @click="togglePin"
            :class="
                    if_pin_active 
                        ? 'bi-pin-angle-fill'
                        : 'bi-pin-angle'
            "
        ></a>

        <a
            @click="tags_manager_opened = !tags_manager_opened"
            class="
                   bi bi-tag-fill p-1
            "
        ></a>

        <a
            class="
                   bi bi-share-fill p-1
            "
        ></a>

        <a
            class="
                   bi bi-trash-fill p-1
            "
        ></a>

    </div>

    <Teleport to="body">

        <Tags_manager
            v-if="note"
            :tags="note.tags.map(tag => Number(tag))"
            v-model:active="tags_manager_opened"
            @update:tags="updateNoteTags"
        />

    </Teleport>

</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import type { Note } from '@/assets/ts/type';
import database from '@/assets/ts/database/database';
import { Notes } from '@/assets/ts/database/Var';
import Tags_manager from '../tags/tags_manager.vue';

const props = defineProps<{
    noteUuid: string;
}>();

const emit = defineEmits([
    'close'
])

const note = ref<Note | undefined>(undefined);
const if_pin_active = ref<boolean>(false);

const tags_manager_opened = ref<boolean>(false);

onMounted(async () => {
    note.value = await database.getNoteByUUID(props.noteUuid);
    if (!note.value) return;
    if_pin_active.value = note.value.pinned;
})



const togglePin = async () => {
    if_pin_active.value = !if_pin_active.value;

    const _note = Notes.value.find(_note => _note.uuid === note.value!.uuid);

    if (!_note || !note.value) return;
    _note.pinned = !note.value.pinned;

    await database.togle_pinned(note.value.id);
};


const updateNoteTags = (newTags: number[]) => {

    const _note = Notes.value.find(_note => _note.uuid === note.value!.uuid);

    if (!_note) return;
    _note.tags =  newTags;

    database.saveTags(newTags, note.value!.id);

};

</script>
