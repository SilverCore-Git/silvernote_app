<template>

  <header class="flex flex-row pt-4 relative">
    <div class="left-arrow absolute left-4" @click="router.push('/')"></div>

    <div class="flex flex-row gap-4 absolute right-4">

      <div
        class="edit_note"
        :style="{
          backgroundImage: if_edit_note_active
            ? `url(${edit_note_Full})`
            : `url(${edit_note_Empty})`
        }"
        @click="if_edit_note_active = !if_edit_note_active"
      ></div>

      <div
        class="pin"
        :style="{
          backgroundImage: if_pin_active
            ? `url(${pinFull})`
            : `url(${pinEmpty})`
        }"
        @click="change_pin_state"
      ></div>

    </div>

  </header>

  <section class="flex flex-col justify-center items-center h-full w-[100%] mt-12 overflow-x-hidden">

    <input class="text-3xl mb-3 font-bold" type="text" placeholder="Titre..." :value="note?.title || ''">

    <RichMarkdownEditor v-if="if_edit_note_active" :content="note?.content || ''" />

    <MarkdownEditor :content="note?.content || ''" v-else />

  </section>


</template>

<script lang="ts" setup>

import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { unpinNoteById, pinNoteById, get_note } from '../assets/ts/use_notes';

const router = useRouter();
const route = useRoute();

import RichMarkdownEditor from '../components/RichMarkdownEditor.vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';

import pinFull from '/assets/webp/pin_plein.webp?url';
import pinEmpty from '/assets/webp/pin_vide.webp?url';

const if_pin_active = ref(route.query.pinned == "true" ? true : false);

// import MathFull from '../assets/svgs/calculation.png?url';
// import MathEmpty from '../assets/svgs/calculation.png?url';

const if_math_active = ref<boolean>(false);

import edit_note_Full from '/assets/webp/note-edit_plein.webp?url';
import edit_note_Empty from '/assets/webp/note-edit_vide.webp?url';

const if_edit_note_active = ref(route.query.simply_edit == 'true' ? true : false);

const note: { 
  title: string
  content: string
  pinned: boolean
  simply_edit: boolean
  id: number
  tags: string[]
} = get_note(Number(route.query.id)) || {
  title: '',
  content: '',
  pinned: false,
  simply_edit: false,
  id: -1,
  tags: []
};

const change_pin_state = () => {
    if_pin_active.value = !if_pin_active.value;
    if (if_pin_active.value) {
        pinNoteById(Number(route.query.id))
    } else {
        unpinNoteById(Number(route.query.id))
    };
    router.push({ 
        query: { 
            ...route.query,
            pinned: if_pin_active.value ? 'true' : 'false'
        }
    });
};

</script>

<style scoped>

.pin,
.math,
.edit_note {
  width: 30px;
  height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}


textarea,
input {
    border: none;
    outline: none;
    width: 90%;
    text-decoration: none;
}


</style>
