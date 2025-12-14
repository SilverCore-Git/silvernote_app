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
            @click="share_menu_opened = !share_menu_opened"  
            class="
                   bi bi-share-fill p-1
            "
        ></a>

        <a
            @click="delete_note(1)"
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

        <Share_menu
            v-if="note"
            :uuid="note.uuid"
            :title="note.title"
            v-model="share_menu_opened"
        />

        <ConfirmDialog
            :visible="dialogue.visible"
            :message="dialogue.message"
            @confirm="delete_note(2)"
            @cancel="dialogue.visible = false"
        />

    </Teleport>

</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import type { Note } from '@/assets/ts/type';
import database from '@/assets/ts/database/database';
import { Notes } from '@/assets/ts/database/Var';
import Tags_manager from '../tags/tags_manager.vue';
import Share_menu from '../popup/share_menu.vue';
import ConfirmDialog from '../popup/ConfirmDialog.vue';

const props = defineProps<{
    noteUuid: string;
}>();

const emit = defineEmits([
    'close'
])

const note = ref<Note | undefined>(undefined);
const if_pin_active = ref<boolean>(false);

const tags_manager_opened = ref<boolean>(false);
const share_menu_opened = ref<boolean>(false);
const dialogue = ref<{
    visible: boolean,
    message: string
}>({
    visible: false,
    message: ''
})

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

const delete_note = async (state: number): Promise<void> => {
    if (!note.value) return;
    if (state == 1) {
        dialogue.value.message = `Êtes vous sur de vouloir supprimer la note : ${note.value?.title}`;
        dialogue.value.visible = true;
    }
    else if (state == 2) {
        dialogue.value.visible = false;
        await database.delete(note.value.id, false);

        Notes.value = Notes.value.filter(_note => _note.id !== note.value?.id);
        emit('close');
    }
    return;
}

</script>
