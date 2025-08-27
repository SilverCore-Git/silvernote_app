<template>

  <header class="flex flex-row relative" style="padding-top: calc(1rem + env(safe-area-inset-top)/2);">

    <div class="left-arrow absolute left-0 cursor-pointer btnHover" @click="router.push('/')" :class="hitbox ? 'bg-red-600' : ''"></div>

    <div class="flex flex-row gap-4 absolute right-0">

      <div
        class="pin cursor-pointer"
        :style="{
          backgroundImage: if_pin_active
            ? `url(${pinFull})`
            : `url(${pinEmpty})`
        }"
        @click="change_pin_state"
      ></div>

      <div
        class="ellipsis-svg w-[30px] h-[30px] rotate-[90deg]"
        @click="if_open_dropdown = !if_open_dropdown"
      ></div>

    </div>

    <transition name="fade-slide">
      
      <div
        v-if="if_open_dropdown"
        class="absolute inset-0 z-40"
        @click="if_open_dropdown = false"
      >

        <div 
          class="dropdown absolute 
                right-0 bg-[var(--bg2)]"
          :style="{ top: `calc(3.4rem + env(safe-area-inset-top))` }"
        >

          <ul>

            <li @click="export_menu = true">Exporter</li>
            <li @click="share_menu = true">Partager</li>
            <li class="text-red-600">Supprimer</li>

          </ul>

        </div>

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

    
    <RichMarkdownEditor 
      v-if="socket"
      v-bind="attrs" 
      :editable="true" 
      :class="hitbox ? 'bg-blue-600' : ''" 
      :id="-2" 
      :uuid="note.uuid"
      :socket="socket"
      :data="note"
    />

  </section>

  <share_menu
    :uuid="note.uuid"
    :title="note.title"
    v-model="share_menu"
  />

  <Popup v-model:visible="export_menu">

    <div class="w-full h-full flex justify-start items-start flex-col gap-2">

      <h2 class="text-xl font-bold mb-4">
        Exporter la note : <span class="font-medium">{{ note.title }}</span>
      </h2>

      <div class="flex flex-row justify-between  w-[80%] mx-4">

        <label class="text-base" for="">Exporter en :</label>
        <select 
          v-model="selected_ext"
          class="px-2.5 pt-1.5 pb-2 rounded-lg border border-gray-300 bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-[var(--btn)] transition-all duration-200"
        >
          <option value="pdf">pdf</option>
          <option value="html">html</option>
        </select>

      </div>

      <div class="flex flex-row w-full justify-end gap-4 mt-4">

        <button
          class="second"
          @click="export_menu = false"
        >
          Annuler
        </button>

        <button
          class="primary"
        >
          Confirmer
        </button>

      </div>

    </div>

  </Popup>

</template>

<script lang="ts" setup>

import { ref, onMounted, onUnmounted, useAttrs, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { io, Socket } from 'socket.io-client';

import db from '../assets/ts/database';
import utils from '../assets/ts/utils';
import { hitbox as if_hitbox } from '../assets/ts/settings';


let hitbox: boolean;
onMounted(async () => { hitbox = await if_hitbox() })
import type { Note } from '../assets/ts/type';

const router = useRouter();
const route = useRoute();

import RichMarkdownEditor from '../components/Markdown/RichMarkdownEditor.vue';

import pinFull from '/assets/webp/pin_plein.webp?url';
import pinEmpty from '/assets/webp/pin_vide.webp?url';
import { api_url } from '@/assets/ts/backend_link';
import Popup from '@/components/Popup.vue';
import Share_menu from '@/components/popup/share_menu.vue';

const if_pin_active = ref(route.query.pinned == "true");
const if_open_dropdown = ref<boolean>(false);
const export_menu = ref<boolean>(false);
const selected_ext = ref<string>('pdf');
const share_menu = ref<boolean>(false);

const attrs = useAttrs();

let socket: Socket;

// Initialisation de la note
const note = ref<Note>({
    title: '',
    content: '',
    pinned: false,
    type: 'text',
    simply_edit: false,
    date: '',
    id: -1,
    uuid: '',
    tags: []
});

const title = ref<HTMLInputElement | null>(null);

const save_title = () => {
  if (note.value.title) {
    db.saveTitle(note.value.title, Number(route.query.id), socket);
  }
}

// Fonction pour récupérer la note
onMounted(async () => {

  if (route.query.id == 'new') {

    console.log('Création d\'une nouvelle note')
    const Note = await db.create({ 
                                  id: -1,
                                  uuid: '',
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

  wSocket();

  const fetchedNote = await db.getNote(Number(route.query.id));

  if (fetchedNote) {
    note.value = fetchedNote;
  }

});

onUnmounted(async () => {
  if (note.value.title == '') {
    console.log('Sauvegarde de la note vide')
    db.saveTitle('Note sans titre', note.value.id, socket);
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
  document.title = `SilverNote - ${note.value.title}`;
}

const wSocket = () => {

    socket = io(api_url, { path: "/socket.io/" });

    socket.on('connect', () => {
        console.log('WebSocket connecté !');
        socket.emit('join_share', { uuid: note.value.uuid });
    });

    socket.on('update_note', (data: { content: string; title: string }) => {
        if (!note.value) return;
        note.value.content = data.content;
        note.value.title = data.title;
    });

    socket.on('disconnect', () => {
        console.log('WebSocket déconnecté !');
    });

};

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

</style>
