<template>

  <div
    class="note-card bg-[#FFF8F0] mr-4 ml-4 text-[#3B3B3B] p-3 border-[#3B3B3B] border-2 relative cursor-pointer"
    style="border-radius: 15px;"
    @click="open_note"
  > 
    <p class="font-bold text-xl w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">{{ title }}</p>

    <div
      class="pin absolute right-3 top-3"
      :style="{
        backgroundImage: if_pin_active
          ? `url(${pinFull})`
          : `url(${pinEmpty})`,
      }"
      @click.stop="change_pin_state"
    ></div>

    <p 
      class="text-mb mb-3 w-[65%] whitespace-nowrap overflow-hidden text-ellipsis"
    >
      {{ content }}
    </p>

    <div class="absolute left-1 bottom-1 w-[60%] whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none">
      <span v-for="(tag, index) in tags" :key="index" class="ml-2 underline">{{ tag }}</span>
    </div>
    <label class="absolute right-2 bottom-1">{{ date }}</label>

  </div>

</template>

<script setup lang="ts">

import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import db from '../assets/ts/database';

import pinFull from '../assets/svgs/pin_plein.png?url'
import pinEmpty from '../assets/svgs/pin_vide.png?url'

const router = useRouter()

const props = defineProps<{
  title: string
  content: string
  date: string
  pinned: boolean
  tags: string[]
  simply_edit: boolean
  id: number
}>()

const if_pin_active = ref(props.pinned)

const change_pin_state = () => {
    if_pin_active.value = !if_pin_active.value;
    db.togle_pinned(props.id);
};

const open_note = () => {
  router.push(`/edit?id=${props.id}&pinned=${if_pin_active.value}&simply_edit=${props.simply_edit}`)
}

watch(() => props.pinned, (newVal) => {
  if_pin_active.value = newVal
})

</script>

<style scoped>

.pin {
  width: 25px;
  height: 25px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

</style>
