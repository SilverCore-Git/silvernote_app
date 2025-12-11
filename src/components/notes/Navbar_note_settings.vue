<template>

    <a>
        <i class=" bi bi-x" />
    </a>

    <div>

                    
        <div
            class="pin w-7 h-7 md:w-6 md:h-6"
            :style="{
            backgroundImage: if_pin_active
                ? `url(${pinFull})`
                : `url(${pinEmpty})`,
            }"
        ></div>

    </div>

</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import pinFull from '/assets/webp/pin_plein.webp?url';
import pinEmpty from '/assets/webp/pin_vide.webp?url';
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

<style scoped>

.pin {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

</style>