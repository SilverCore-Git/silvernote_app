<template>

  <header class="flex flex-row relative" style="padding-top: calc(1rem + env(safe-area-inset-top)/2);">

    <div class="left-arrow absolute left-0 cursor-pointer" @click="router.push('/')" :class="hitbox ? 'bg-red-600' : ''"></div>

    <div class="flex flex-row gap-4 absolute right-0">

      <div
        class="pin"
        :style="{
          backgroundImage: if_pin_active
            ? `url(${pinFull})`
            : `url(${pinEmpty})`
        }"
        :class="hitbox ? 'bg-red-600' : ''"
        @click="change_pin_state"
      ></div>

    </div>

  </header>

  <section class="flex flex-col justify-center items-center h-full mb:mr-[10%] mb:ml-[10%] mt-12 overflow-x-hidden">

    <input 
      class="text-3xl mb-3 font-bold" 
      type="text" 
      placeholder="Titre..." 
      ref="title"
      v-model="note.title"
      @input="save_title"
      :class="hitbox ? 'bg-indigo-600' : ''"
    />

    <RichMarkdownEditor v-bind="attrs" :class="hitbox ? 'bg-blue-600' : ''" :id="note.id" />

  </section>

</template>

<script lang="ts" setup>

import { ref, onMounted, onUnmounted, useAttrs } from 'vue';

import { useRouter, useRoute } from 'vue-router';

import db from '../assets/ts/database';
import utils from '../assets/ts/utils';
import { hitbox as if_hitbox } from '../assets/ts/settings';


let hitbox: boolean;
onMounted(async () => { hitbox = await if_hitbox() })
import type { Note } from '../assets/ts/type';

const router = useRouter();
const route = useRoute();

import RichMarkdownEditor from '../components/RichMarkdownEditor.vue';

import pinFull from '/assets/webp/pin_plein.webp?url';
import pinEmpty from '/assets/webp/pin_vide.webp?url';

const if_pin_active = ref(route.query.pinned == "true");

const attrs = useAttrs()

// Initialisation de la note
const note = ref<Note>({
    title: '',
    content: '',
    pinned: false,
    simply_edit: false,
    date: '',
    id: -1,
    tags: []
});

const title = ref<HTMLInputElement | null>(null);

const save_title = () => {
  if (note.value.title) {
    db.saveTitle(note.value.title, Number(route.query.id))
  }
}

// Fonction pour récupérer la note
onMounted(async () => {

  setTimeout(() => {
    title.value?.focus();
  }, 200);

  if (route.query.id == 'new') {
    console.log('Création d\'une nouvelle note')
    const Note = await db.create({ 
                                  id: -1,
                                  pinned: false,
                                  simply_edit: false,
                                  title: note.value.title,
                                  content: note.value.content,
                                  date: utils.date(),
                                  tags: []
                              });

    console.log(Note.id)
    note.value.id = Note.id || -1;
    router.push({ 
      query: { 
        ...route.query,
        id: Note.id
      }
    });
};

  const fetchedNote = await db.getNote(Number(route.query.id));

  if (fetchedNote) {
    note.value = fetchedNote;
  }

});

onUnmounted(async () => {
  if (note.value.title == '') {
    console.log('Sauvegarde de la note vide')
    db.saveTitle('Note sans titre', note.value.id);
  };
});

// Fonction pour changer l'état du pin
const change_pin_state = (): void => {
  if_pin_active.value = !if_pin_active.value;
  db.togle_pinned(Number(route.query.id));
  router.push({ 
    query: { 
      ...route.query,
      pinned: if_pin_active.value ? 'true' : 'false'
    }
  });
  db.togle_pinned(Number(route.query.id));
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
