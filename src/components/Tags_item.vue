<template>

    <div
      @contextmenu.prevent="onLongPress"
      @touchstart="startPress"
      @touchend="cancelPress"
      @touchcancel="cancelPress"
      :class="active ? 'bg-[var(--bg2)] p-0.5 lg:p-1.5 text-center border-3 border-[#F28C28] cursor-pointer' 
                     : 'p-1 lg:p-2 text-center border-1 cursor-pointer'" 
      class="rounded-[15px] text-mb lg:rounded-[15px] bg-[var(--bg2)] flex flex-row justify-center items-center"
    >
        <span>{{ name }}</span>

    <section
      v-if="menu"
      class="border-l-1 ml-1 pl-1 flex"
    >

      <ul>
          <li @click.stop="del" class=" cursor-pointer"><div class="bin-svg w-5 h-5"></div></li>
      </ul>

    </section>

    </div>

</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue';

import db from '../assets/ts/database';
import type { Tag } from '../assets/ts/type'

const props = defineProps<{
  name: string,
  tag: string,
  active: boolean
}>();


const inputRef = ref<HTMLInputElement | null>(null);

const menu = ref<boolean>(false);

const del = async (): Promise<void> => {
  const tags: Tag[] = await db.getAll('tags');
  const tag: Tag | undefined = tags.find(tag => tag.name == props.name);
  if (tag) db.delete_tag(tag.id);
  window.location.reload();
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

