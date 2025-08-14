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

      <div
        class="ellipsis-svg w-[30px] h-[30px]"
        :class="hitbox ? 'bg-red-600' : ''"
        @click="if_open_dropdown = !if_open_dropdown"
      ></div>

    </div>

    <transition name="fade-slide">
      
      <div
        v-if="if_open_dropdown"
        class="dropdown absolute right-0 border-2 border-[var(--btn)]
            z-50 min-w-[200px] w-[40%] md:w-[20%] lg:w-[10%] 
            flex flex-col justify-center items-center p-3"
        :style=" { top: `calc(3.5rem + env(safe-area-inset-top))` } "
      >
      
      <ul class="text-xl md:text-lg ">

            <li @click="noteTypeManager = true; if_open_dropdown = false"><a class="cursor-pointer">Paramettres</a></li>
            <li><a class="cursor-pointer">Vider</a></li>
            <li><a class="cursor-pointer">Suprimer</a></li>

        </ul>
      
      </div>
    
    </transition>

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

    <ToDoList :data="JSON.parse(note.content) || []" :id="note.id" v-if="AToDoList" />
    <RichMarkdownEditor v-else v-bind="attrs" :class="hitbox ? 'bg-blue-600' : ''" :id="note.id" />

  </section>

  <Note_type_manager :id="note.id" v-if="noteTypeManager" />

</template>

<script lang="ts" setup>

import { ref, onMounted, onUnmounted, useAttrs, watch } from 'vue';

import { useRouter, useRoute } from 'vue-router';

import ToDoList from '@/components/notes/ToDoList.vue';

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
import Note_type_manager from '@/components/notes/Note_type_manager.vue';

const if_pin_active = ref(route.query.pinned == "true");
const if_open_dropdown = ref<boolean>(false);
const noteTypeManager = ref<boolean>(false);
const attrs = useAttrs();

// Initialisation de la note
const note = ref<Note>({
    title: '',
    content: '',
    pinned: false,
    type: 'text',
    simply_edit: false,
    date: '',
    id: -1,
    tags: []
});

const AToDoList = ref<boolean>(note.value.type == "todolist");
const title = ref<HTMLInputElement | null>(null);

const save_title = () => {
  if (note.value.title) {
    db.saveTitle(note.value.title, Number(route.query.id))
  }
}

// Fonction pour récupérer la note
onMounted(async () => {

  if (route.query.id == 'new') {
    console.log('Création d\'une nouvelle note')
    const Note = await db.create({ 
                                  id: -1,
                                  pinned: false,
                                  simply_edit: false,
                                  title: note.value.title,
                                  content: note.value.content,
                                  type: note.value.type,
                                  date: utils.date(),
                                  tags: []
                              });

    console.log(Note)
    note.value.id = Note.id || -1;
    router.push({ 
      query: { 
        ...route.query,
        id: Note.id
      }
    });

    setTimeout(() => {
      title.value?.focus();
    }, 1000);

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

const update_title = () => {
  document.title = `SilverNote - edit - ${note.value.title}`;
}

watch(() => note.value.title, () => {
  update_title();
})

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

.ellipsis-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/assets/svgs/ellipsis.svg');
    filter: brightness(0) saturate(100%) invert(61%) sepia(43%) saturate(1182%) hue-rotate(343deg) brightness(99%) contrast(92%);
    transition: all 0.3s ease;
}

.dropdown {
    border-bottom-left-radius: var(--br-btn);
    border-bottom-right-radius: var(--br-btn);
}

</style>
