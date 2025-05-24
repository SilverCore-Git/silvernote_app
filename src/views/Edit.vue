<template>

  <header class="flex flex-row pt-4 relative">
    <div class="left-arrow absolute left-4" @click="router.push('/')"></div>
    <div
      class="pin absolute right-4"
      :style="{
        backgroundImage: if_pin_active
          ? `url(${pinFull})`
          : `url(${pinEmpty})`
      }"
      @click="change_pin_state"
    ></div>
  </header>

  <section class="flex flex-col justify-center items-center h-full w-[100%] mt-12 overflow-x-hidden">

    <input class="text-3xl mb-3 font-bold" type="text" placeholder="Titre...">

    <RichMarkdownEditor  />

  </section>


</template>

<script lang="ts" setup>

import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

import RichMarkdownEditor from '../components/RichMarkdownEditor.vue';

import pinFull from '../assets/svgs/pin_plein.png?url';
import pinEmpty from '../assets/svgs/pin_vide.png?url';

const if_pin_active = ref(route.query.pinned == "true" ? true : false);

const change_pin_state = () => {
  if_pin_active.value = !if_pin_active.value;
};



</script>

<style scoped>

.left-arrow,
.pin {
  width: 30px;
  height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.left-arrow {
  background-image: url('../assets/svgs/left_arrow.svg');
  filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
}


textarea,
input {
    border: none;
    outline: none;
    width: 90%;
    text-decoration: none;
}


</style>
