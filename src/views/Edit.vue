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
        @click="change_edit_state"
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

    <input 
      class="text-3xl mb-3 font-bold" 
      type="text" 
      placeholder="Titre..." 
      v-model="note.title"
    />

    <RichMarkdownEditor :simplify_text="if_edit_note_active" :id="note.id" />

    <!-- <MarkdownEditor :id="note.id" v-else /> -->

  </section>

</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import db from '../assets/ts/database';

const router = useRouter();
const route = useRoute();

// Importation des composants
import RichMarkdownEditor from '../components/RichMarkdownEditor.vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';

import pinFull from '/assets/webp/pin_plein.webp?url';
import pinEmpty from '/assets/webp/pin_vide.webp?url';
import edit_note_Full from '/assets/webp/note-edit_plein.webp?url';
import edit_note_Empty from '/assets/webp/note-edit_vide.webp?url';

// État pour la gestion de l'édition et du pin
const if_pin_active = ref(route.query.pinned == "true");
const if_edit_note_active = ref(route.query.simply_edit == 'true');

// Initialisation de la note
const note = ref<{
        id: number
        pinned: boolean
        simply_edit: boolean
        title: string
        content: string
        tags: string[]
  }>({
    title: '',
    content: '',
    pinned: false,
    simply_edit: false,
    id: -1,
    tags: []
});

// Fonction pour récupérer la note
onMounted(async () => {
  const fetchedNote = await db.getNote(Number(route.query.id));
  if (fetchedNote) {
    note.value = fetchedNote;
  }
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

// Fonction pour changer l'état
const change_edit_state = (): void => {
  if_edit_note_active.value = !if_edit_note_active.value;

  router.push({ 
    query: { 
      ...route.query,
      simply_edit: if_edit_note_active.value ? 'true' : 'false'
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
