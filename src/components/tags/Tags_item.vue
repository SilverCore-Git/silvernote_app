<template>
    <div
      v-bind="$attrs"
      @contextmenu.prevent="onLongPress"
      @touchstart="startPress"
      @touchend="cancelPress"
      @touchcancel="cancelPress"
      :class="active 
        ? 'border-3 px-2.5 py-0.5 border-[#F28C28] cursor-pointer' 
        : 'border-1 px-3 py-1 cursor-pointer'"
      class="inline-flex items-center justify-center 
            text-md uppercase text-center rounded-[var(--br-btn)] 
            whitespace-nowrap select-none"
      :style="{ backgroundColor: tag_color, color: text_color }"
    >
      <span class="md:text-base">
        {{ name }}
      </span>
    </div>

    <teleport to="body">

      <div class="text-white" @click.stop="menu = false" v-if="menu">

        <div  class="fixed inset-0 bg-[#00000090] z-100" style="backdrop-filter: blur(3px);"></div>

        <section class="flex flex-col gap-4 text-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-110">

          <h3 class="text-xl font-bold">modifier : {{ name }}</h3>

            <div @click.stop="" class="text-[var(--text)] flex flex-col justify-center items-center border-2 h-full bg-[var(--bg2)]/80 border-[#F28C28] rounded-[var(--br-btn)] shadow-lg" >
                <span class="font-bold">couleur de {{ name }}</span>
                <input
                    v-model="tag_color"
                    type="color"
                    class="outline-none w-full h-10 cursor-pointer rounded-[var(--br-btn)] border-none"
                />
            </div>

            <button
                @click.stop="save_tag_color(); menu = false; menu = false"
                class="primary"
            >
                <span>Sauvegarder</span>
            </button>
            <button
                class="danger primary"
                @click.stop="del(1); menu = false"
            >
                <span>Supprimer</span>
            </button>
            <button
                class="second" style="color: white;"
                @click.stop=" menu = false; tag_color = color"
            >
                <span>Annuler</span>
            </button>

        </section>

      </div>

      <ConfirmDialog 
        :visible="dialog"
        message="Êtes vous sur de vouloir supprimer ce dossier ?"
        @confirm="del(2); dialog = false"
        @cancel="dialog = false"
      />

    </teleport>

</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue';

import utils from '../../assets/ts/utils';
import db from '../../assets/ts/database';
import { isOnline } from '../../assets/ts/online';
import back from '../../assets/ts/backend_link';
import type { Tag } from '../../assets/ts/type'
import ConfirmDialog from '../popup/ConfirmDialog.vue';

const props = defineProps<{
  name: string,
  tag: string,
  active: boolean,
  color: string,
}>();

const emit = defineEmits([
  'reload'
])

const text_color: string = utils.get_text_color(props.color);
const inputRef = ref<HTMLInputElement | null>(null);
const tag_color = ref<string>(props.color);
const dialog = ref<boolean>(false);

const menu = ref<boolean>(false);

const del = async (state: 1 | 2): Promise<void> => {

  if (state == 1) {
    dialog.value = true;
  } 
  else 
  {
    const tags: Tag[] = await db.getAll('tags');
    const tag: Tag | undefined = tags.find(tag => tag.name == props.name);
    if (tag) await db.delete_tag(tag.id);
    if (isOnline) await back.save_db();
    emit('reload');
  }
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

