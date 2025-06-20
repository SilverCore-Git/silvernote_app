<template>

    <div
      v-bind="$attrs"
      @contextmenu.prevent="onLongPress"
      @touchstart="startPress"
      @touchend="cancelPress"
      @touchcancel="cancelPress"
      :class="active ? 'p-0.5 lg:p-1.5 text-center border-3 border-[#F28C28] cursor-pointer' 
                     : 'p-1 lg:p-2 text-center border-1 cursor-pointer'" 
      class="rounded-[var(--br-btn)] text-mb lg:rounded-[var(--br-btn)] flex flex-row justify-center items-center select-none"
      :style="{ backgroundColor: tag_color, color: text_color }"
    >
        <span class="pr-2 pl-2">{{ name }}</span>

      <section
        v-if="menu"
        class="border-l-1 ml-1 pl-1 flex bg-[var(--bg2)]"
      >

        <ul class="flex flex-row">
            <li @click.stop="del" class=" cursor-pointer"><div class="bin-svg w-5 h-5"></div></li>
            <li @click.stop="if_open_manage_tag = true" class=" cursor-pointer"><div class="color-svg w-4 h-4"></div></li>
        </ul>

      </section>

    </div>

        <div @click.stop="if_open_manage_tag = false" v-if="if_open_manage_tag">

        <div  class="fixed inset-0 bg-black/50 z-100"></div>

            <section class="flex flex-col gap-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-110">

            <div @click.stop="" class="flex flex-col justify-center items-center border-2 h-full bg-[var(--bg2)]/80 border-[#F28C28] rounded-[var(--br-btn)] shadow-lg" >
                <span>couleur de mon dossier</span>
                <input
                    v-model="tag_color"
                    type="color"
                    class="outline-none w-full h-10 cursor-pointer rounded-[var(--br-btn)] border-none"
                />
            </div>

            <button
                @click.stop="save_tag_color; if_open_manage_tag = false; menu = false"
                class="p-1 text-center w-full border-2 bg-white/80 font-bold cursor-pointer rounded-[var(--br-btn)] shadow-md
                        hover:bg-[#f28c28]"
            >
                <span>Sauvegarder</span>
            </button>
            <button
                class="p-1 text-center w-full border-2 bg-white/80 font-bold cursor-pointer rounded-[var(--br-btn)] shadow-md
                        hover:bg-[#f25728]"
                @click.stop="if_open_manage_tag = false; menu = false; tag_color = color"
            >
                <span>Annuler</span>
            </button>

        </section>

    </div>

</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue';

import utils from '../assets/ts/utils';
import db from '../assets/ts/database';
import type { Tag } from '../assets/ts/type'

const props = defineProps<{
  name: string,
  tag: string,
  active: boolean,
  color: string,
}>();

const if_open_manage_tag = ref<boolean>(false);
const text_color: string = utils.get_text_color(props.color);
const inputRef = ref<HTMLInputElement | null>(null);
const tag_color = ref<string>(props.color);


const menu = ref<boolean>(false);

const del = async (): Promise<void> => {
  const tags: Tag[] = await db.getAll('tags');
  const tag: Tag | undefined = tags.find(tag => tag.name == props.name);
  if (tag) db.delete_tag(tag.id);
  window.location.reload();
}

const save_tag_color = async () => {
  const tags: Tag[] = await db.getAll('tags');
  const tag: Tag | undefined = tags.find(tag => tag.name == props.name);
  await db.save_tag_color(tag?.id || -1, tag_color.value)
}

const pressTimer = ref<number | null>(null);
const delay = 1000; 

function onLongPress() {
  menu.value = !menu.value;
}

function startPress() {
  cancelPress()
  pressTimer.value = window.setTimeout(() => {
    onLongPress()
  }, delay)
}

function cancelPress() {
  if (pressTimer.value !== null) {
    clearTimeout(pressTimer.value)
    pressTimer.value = null
  }
}

onMounted(() => {
  if (props.name === 'create_tag' && inputRef.value) {
    inputRef.value.focus();
  }
});

</script>

<style scoped>

.bin-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../assets/svgs/bin.svg');
    filter: invert(36%) sepia(76%) saturate(4375%) hue-rotate(-10deg) brightness(92%) contrast(110%);
    transition: all 0.3s ease;
}


input:focus {
  border-color: #F28C28;
  outline: none;
}

button:hover {
  background-color: #f28c28;
}
</style>

