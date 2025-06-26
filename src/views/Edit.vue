<template>

  <header class="flex flex-row relative" style="padding-top: calc(1rem + env(safe-area-inset-top)/2);">

    <div class="left-arrow absolute left-4 cursor-pointer" @click="router.push('/')" :class="hitbox ? 'bg-red-600' : ''"></div>

    <div class="flex flex-row gap-4 absolute right-4">

      <!-- <div
        class="edit_note"
        :style="{
          backgroundImage: if_edit_note_active
            ? `url(${edit_note_Full})`
            : `url(${edit_note_Empty})`
        }"
        :class="hitbox ? 'bg-red-600' : ''"
        @click="change_edit_state"
      ></div> -->

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

  <section class="flex flex-col justify-center items-center h-full  lg:mr-[20%] lg:ml-[20%] 2xl:mr-[30%] 2xl:ml-[30%] mt-12 overflow-x-hidden">

    <input 
      class="text-3xl mb-3 font-bold" 
      type="text" 
      placeholder="Titre..." 
      ref="title"
      v-model="note.title"
      @input="save_title"
      :class="hitbox ? 'bg-indigo-600' : ''"
    />

    <RichMarkdownEditor :class="hitbox ? 'bg-blue-600' : ''" :simplify_text="if_edit_note_active" :id="note.id" />

    <!-- <MarkdownEditor :id="note.id" v-else /> -->

  </section>

</template>

<script lang="ts" setup>

import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import db from '../assets/ts/database';
import utils from '../assets/ts/utils';
import { hitbox as if_hitbox } from '../assets/ts/settings';


let hitbox: boolean;
onMounted(async () => { hitbox = await if_hitbox() })
import type { Note } from '../assets/ts/type';

const router = useRouter();
const route = useRoute();

// Importation des composants
import RichMarkdownEditor from '../components/RichMarkdownEditor.vue';
//import MarkdownEditor from '../components/MarkdownEditor.vue';

import pinFull from '/assets/webp/pin_plein.webp?url';
import pinEmpty from '/assets/webp/pin_vide.webp?url';
// import edit_note_Full from '/assets/webp/note-edit_plein.webp?url';
// import edit_note_Empty from '/assets/webp/note-edit_vide.webp?url';

// État pour la gestion de l'édition et du pin
const if_pin_active = ref(route.query.pinned == "true");
const if_edit_note_active = ref(route.query.simply_edit == 'true');

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

// Fonction pour changer l'état
// const change_edit_state = (): void => {
//   if_edit_note_active.value = !if_edit_note_active.value;

//   router.push({ 
//     query: { 
//       ...route.query,
//       simply_edit: if_edit_note_active.value ? 'true' : 'false'
//     }
//   });
// };

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
