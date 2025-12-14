<template>

    <a>
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
            :class="
                    if_pin_active 
                        ? 'bi-pin-angle-fill'
                        : 'bi-pin-angle'
            "
        ></a>

        <a
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

</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import type { Note } from '@/assets/ts/type';
import database from '@/assets/ts/database/database';

const props = defineProps<{
    noteUuid: string;
}>();

const note = ref<Note | undefined>(undefined);
const if_pin_active = ref<boolean>(false);

onMounted(async () => {
    note.value = await database.getNoteByUUID(props.noteUuid);
    if (!note.value) return;
    if_pin_active.value = note.value.pinned;
})

</script>
