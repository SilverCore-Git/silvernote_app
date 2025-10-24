<template>


        <div class="absolute inset-0">

            
            <div 
                class="z-25 fixed inset-0" 
                @click="emitClose()" 
                v-if="visible"
            ></div>

            <transition name="fade-slide">

                <div
                    v-if="visible"
                    @click="emitClose()"
                    class="dropdown inset-x-0 absolute z-30"                    
                >

                    <ul>

                        <li
                            @click="change_pin_state()"
                        >

                            <div
                                class="pin mr-2 w-7 h-7 md:w-6 md:h-6"
                                :style="{
                                backgroundImage: if_pin_active
                                    ? `url(${pinFull})`
                                    : `url(${pinEmpty})`,
                                }"
                            ></div>

                            {{ if_pin_active ? 'Désépingler' : 'Épingler' }}

                        </li>

                        <li
                            @click="manage_tags = true"
                        >
                            
                            <div
                                class="folder-svg
                                        mr-2
                                        w-7
                                        h-7
                                    "
                            ></div>

                            Modifier les tags

                        </li>

                        <li
                            @click="share = true"
                        >

                            <div
                                class="share-svg
                                        mr-2
                                        w-6
                                        h-6
                                    "
                            ></div>

                            Partager

                        </li>

                        <li
                            @click="delete_note(1)"
                        >

                            <div
                                class="bin-svg
                                        mr-2
                                        w-7
                                        h-7
                                    "
                            ></div>

                            Supprimer

                        </li>


                    </ul>
                
                </div>

            </transition>

            <Tags_manager
                v-if="note"
                :active="manage_tags"
                :tags="note.tags.map(tag => Number(tag))"
                @update:tags="onTagsUpdate"
                @update:active="manage_tags = $event; function_reload()"
            />

            <Share_menu
                v-if="note"
                :uuid="note!.uuid"
                :title="note!.title"
                v-model="share"
            />

            <ConfirmDialog 
                :visible="dialogue.visible"
                :message="dialogue.message"
                @confirm="delete_note(2)"
                @cancel="dialogue.visible = false"
            />

        </div>


</template>


<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import db from '@/assets/ts/database/database';

import type { Note } from '@/assets/ts/type';
import Share_menu from '../popup/share_menu.vue';
import Tags_manager from '../tags/tags_manager.vue';

import pinFull from '/assets/webp/pin_plein.webp?url';
import pinEmpty from '/assets/webp/pin_vide.webp?url';
import ConfirmDialog from '../popup/ConfirmDialog.vue';

const props = defineProps<{
    id: number;
    visible: boolean;
    top: number;
    left: number;
    function_reload: () => Promise<any>;
}>();

const emit = defineEmits(['update:visible']);

const emitClose = () => {
  emit('update:visible', false);
};

const share = ref<boolean>(false);
const manage_tags = ref<boolean>(false);
const note = ref<Note | undefined>(undefined);
const if_pin_active = ref<boolean>(false);
const dialogue = ref<{
    visible: boolean,
    message: string
}>({
    visible: false,
    message: ''
})


const delete_note = async (state: number): Promise<void> => {
    if (state == 1) {
        dialogue.value.message = `Êtes vous sur de vouloir supprimer la note : ${note.value?.title}`;
        dialogue.value.visible = true;
    }
    else if (state == 2) {
        dialogue.value.visible = false;
        await db.delete(props.id, false);

        emit('update:visible', false);
        props.function_reload()
    }
    return;
}

const change_pin_state = async () => {
    if_pin_active.value = !if_pin_active.value;
    await db.togle_pinned(props.id);
    props.function_reload();
};

const onTagsUpdate = (newTags: number[]) => {
  db.saveTags(newTags, props.id);
  props.function_reload();
};

onMounted(async () => {

    if (!props.id) return;

    note.value = await db.getNote(props.id);

    if (!note.value) note.value = await db.getNote(props.id);
    if (!note.value) return;

    if_pin_active.value = note.value.pinned;

})

</script>

<style scoped>

.ellipsis-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/assets/svgs/ellipsis.svg');
    filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
    transition: all 0.3s ease;
}

.bin-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/assets/svgs/bin.svg');
    filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
    transition: all 0.3s ease;
}

.folder-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../assets/svgs/folder.svg');
    filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
    transition: all 0.3s ease;
}

.share-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../assets/svgs/share.svg');
    filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
    transition: all 0.3s ease;
}

.pin {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.svg-arrow {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../assets/svgs/arrow.svg');
    filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
    transform: rotate(180deg);
    transition: all 0.3s ease;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  transform: translateY(-20px) scale(0.95);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  transform: translateY(0) scale(1);
}

</style>