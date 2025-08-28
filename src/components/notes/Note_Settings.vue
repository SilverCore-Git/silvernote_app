<template>

    <transition name="fade-slide">

        <div 
            v-show="visible"
            class="
                top-0 text-2xl font-bold w-full
                bg-[var(--btn)] min-h-13 inset-x-0
                flex items-center justify-center fixed z-50
            "
            style="box-shadow: 0 0 15px #36363681; padding-top: calc(env(safe-area-inset-top)/2);"
        >

            <div class="flex flex-row justify-between items-center w-full ml-[var(--mrl)] mr-[var(--mrl)]">
                
                <div class="flex flex-row justify-center items-center">

                    <div class="w-8 h-8 svg-arrow" @click="emitClose"></div>

                </div>

                <div class="flex flex-row justify-center items-center gap-6 md:gap-5">

                    <div
                        class="pin w-7 h-7 md:w-6 md:h-6"
                        :style="{
                        backgroundImage: if_pin_active
                            ? `url(${pinFull})`
                            : `url(${pinEmpty})`,
                        }"
                        @click.stop="change_pin_state()"
                    ></div>

                    <div
                        class="folder-svg
                                w-7
                                h-7
                            "
                            @click="manage_tags = true"
                    ></div>

                    <div
                        class="bin-svg
                                w-7
                                h-7
                            "
                    ></div>

                    <div
                        class="share-svg
                                w-6
                                h-6
                            "
                        @click="share = true"
                    ></div>

                    <!-- <div
                        class="ellipsis-svg
                                w-8
                                h-8
                            "
                        @click="if_open_dropdown = !if_open_dropdown"
                    ></div> -->

                </div>

                    <transition name="fade-slide">

                        <div
                            v-if="if_open_dropdown"
                            class="dropdown color absolute bg-[var(--btn)] text-white z-50 right-0 md:right-auto"
                            :style="{ top: `calc(3rem + env(safe-area-inset-top))` }"
                        >

                            <ul>

                                <li></li>
                                <li></li>
                                <li></li>

                                <span class="text-base flex justify-center w-full mt-1">version : {{ version }}</span>
                                
                            </ul>

                        </div>

                    </transition>

            </div>

        </div>

    </transition>

    <Teleport to="body">

        <div>

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

        </div>

    </Teleport>

</template>


<script lang="ts" setup>

import { version } from '@/../package.json';
import { onMounted, ref } from 'vue';
import db from '@/assets/ts/database';

import type { Note } from '@/assets/ts/type';
import Share_menu from '../popup/share_menu.vue';
import Tags_manager from '../tags/tags_manager.vue';

import pinFull from '/assets/webp/pin_plein.webp?url';
import pinEmpty from '/assets/webp/pin_vide.webp?url';

const props = defineProps<{
    id: number;
    visible: boolean;
    function_reload: () => Promise<any>;
}>();

const emit = defineEmits(['update:visible']);

const emitClose = () => {
  emit('update:visible', false);
  props.function_reload();
};

const share = ref<boolean>(false);
const manage_tags = ref<boolean>(false);
const if_open_dropdown = ref<boolean>(false);
const note = ref<Note | undefined>(undefined);
const if_pin_active = ref<boolean>(false);


const change_pin_state = async () => {
    if_pin_active.value = !if_pin_active.value;
    await db.togle_pinned(props.id);
};

const onTagsUpdate = (newTags: number[]) => {
  db.saveTags(newTags, props.id);
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
    filter: invert(1);
    transition: all 0.3s ease;
}

.bin-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/assets/svgs/bin.svg');
    filter: invert(1);
    transition: all 0.3s ease;
}

.folder-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../assets/svgs/folder.svg');
    filter: invert(1);
    transition: all 0.3s ease;
}

.share-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../assets/svgs/share.svg');
    filter: invert(1);
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
    filter: invert(1);
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