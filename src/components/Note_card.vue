<template>

    <div class="bg-[#FFF8F0] mr-4 ml-4 text-[#3B3B3B] p-3 border-[#3B3B3B] border-2 relative cursor-pointer" style="border-radius: 15px;">
        <span class="font-bold text-xl">{{ title }}</span>
        <div
            class="pin absolute right-3 top-3"
            :style="{
                backgroundImage: if_pin_active
                ? `url(${pinFull})`
                : `url(${pinEmpty})`
            }"
            @click="change_pin_state"
        ></div>
        <p class=" text-lg">{{ content }}</p>
        <label class="absolute right-2 bottom-1">{{ date }}</label>
    </div>

</template>

<script setup lang="ts">

import { ref, watch } from 'vue'
import pinFull from '../assets/svgs/pin_plein.png?url'
import pinEmpty from '../assets/svgs/pin_vide.png?url'


const props = defineProps<{
  title: string
  content: string
  date: string
  pinned: boolean
}>()


const if_pin_active = ref(props.pinned)

const change_pin_state = () => {
  if_pin_active.value = !if_pin_active.value
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