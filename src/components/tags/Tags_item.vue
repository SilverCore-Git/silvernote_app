<template>
    <div
      v-bind="$attrs"
      @contextmenu.prevent="onLongPress"
      @touchstart="startPress"
      @touchend="cancelPress"
      @touchcancel="cancelPress"
      :class="active 
        ? 'border-3 px-1.5 py-0.5 border-[#F28C28] cursor-pointer' 
        : 'border-1 px-2 py-1 cursor-pointer'"
      class="inline-flex items-center justify-center 
            text-md uppercase text-center rounded-xl
            whitespace-nowrap select-none"
      :style="{ backgroundColor: tag_color, color: text_color }"
    >
      <span class="md:text-sm">
        {{ name }}
      </span>
    </div>

    <teleport to="body">

      <div>

        <div 
            class="z-25 fixed inset-0" 
            @click="menu = false" 
            v-if="menu"
        ></div>

        <transition name="fade-slide">

          <div 
            class="dropdown absolute"
            :style="{ top: `${top}px`, left: `${left}px` }"
            v-if="menu"
          >

            <ul>

              <li class="flex flex-col">
                <span class="">Changer la couleur</span>
                <input
                  @change="save_tag_color"
                  v-model="tag_color"
                  type="color"
                  class="outline-none w-full h-10 cursor-pointer rounded-[var(--br-btn)] border-none"
                />
              </li>

              <li @click="del(1)" class="text-red-600">Suprimer</li>

            </ul>

          </div>

        </transition>

      </div>

      <ConfirmDialog 
        :visible="dialog"
        message="Êtes vous sur de vouloir supprimer ce tag ?"
        @confirm="del(2); dialog = false"
        @cancel="dialog = false"
      />

    </teleport>

</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue';

import utils from '@/assets/ts/utils';
import db from '@/assets/ts/database/database';
import type { Tag } from '@/assets/ts/type'
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

const left = ref<number>(0);
const top = ref<number>(0);
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
  document.addEventListener('contextmenu', (e) => {

    e.preventDefault();

    left.value = e.clientX;
    top.value = e.clientY;

  })
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

