<template>

  <header class="flex flex-row relative" style="padding-top: calc(1rem + env(safe-area-inset-top)/2);">

    <a><div class="left-arrow absolute left-0 cursor-pointer btnHover" @click="router.push('/')" :class="hitbox ? 'bg-red-600' : ''"></div></a>

    <div class="flex flex-row gap-4 absolute right-0">

      <div
        v-if="users.length > 0"
        class="flex justify-center items-center flex-row gap-4"
      >

        <div
          class="flex -space-x-3"
        >

          <img
              v-if="users.length > 0"
              v-for="user in users"
              class="w-8 h-8  rounded-full border-1 border-gray-200"
              :src="user.imageUrl"
          />

        </div>

        <a 
            class="
                cursor-pointer hover:bg-gray-200 hover:text-[var(--text)]
                py-1 px-3 rounded-xl transition-all duration-200
                border-2 border-gray-200
            "
            @click="router.push(`/share/${note.uuid}`)"
        >Partage</a>

      </div>

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

            <li v-if="editor" @click="()=> editor?.chain().focus().undo().run()">Annuler</li>
            <li v-if="editor" @click="()=> editor?.chain().focus().redo().run()">Rétablir</li>

            <hr />

            <li @click="export_menu = true">Exporter</li>
            <li @click="share_menu = true">Partager</li>
            <li class="text-red-600" @click="delete_note(1)">Supprimer</li>

            <hr />

            <li
              class="flex flex-col"
            >

              <div
                class="flex flex-col text-[12px]
                       justify-start items-start"
              >

                <span>
                  Nombres de mots : 
                  {{ isLoaded ? stats?.getWordCount() : '...' }}
                </span>

                <span>
                  Nombres de caractere : 
                  {{ isLoaded ? stats?.getCharacterCount() : '...' }}
                </span>

              </div>

            </li>

          </ul>

        </div>

      </div>
    
    </transition>

  </header>

  <section 
    v-if="!loaded && !note.title" 
    class="flex flex-col justify-start items-center h-full mt-12 overflow-x-hidden"
  >

    <div 
      class="text-3xl mb-3 font-bold animate-pulse bg-gray-300 h-10 w-full rounded-2xl" 
    ></div>

    
    <div class="animate-pulse bg-gray-300 h-50 w-full rounded-2xl"></div>


  </section>

  <section 
    v-if="loaded" 
    @click="if_open_dropdown = false"
    class="flex flex-col justify-start items-center h-full 
          mt-12 overflow-x-hidden overflow-y-scroll"
  >

    <div class="w-full flex justify-start ml-[10%] ">

      <button ref="emojiBtn">

        <img
          v-if="note.icon" 
          class="w-[64px] h-[64px] cursor-pointer" 
          :src="note.icon" 
        />

        <a 
          v-else
          class="px-1"
        >
          Ajouter une icon
        </a>

      </button>
    
    </div>

    <input 
      class="text-3xl mb-3 font-bold" 
      type="text" 
      placeholder="Titre..." 
      ref="title"
      v-model="note.title"
    />

    
    <RichMarkdownEditor 
      v-if="loaded"
      v-bind="attrs" 
      :editable="true"
      :id="-2" 
      :uuid="note.uuid"
      :data="note"
      class="mb-20"
    />

  </section>

  <share_menu
    :uuid="note.uuid"
    :title="note.title"
    v-model="share_menu"
  />

  <ConfirmDialog
    :visible="showDialog"
    title="Confirmation"
    message="Voulez-vous vraiment supprimer cette note ?"
    @confirm="delete_note(2)"
    @cancel="showDialog = false"
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
          :class="export_loading ? 'loader' : ''"
          @click="export_note(selected_ext)"
        >
          Confirmer
        </button>

      </div>

    </div>

  </Popup>

</template>

<script lang="ts" setup>

import { ref, onMounted, useAttrs, watch, onBeforeUnmount, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { io, Socket } from 'socket.io-client';
import { EmojiButton } from '@joeattardi/emoji-button';
import { useUser } from '@clerk/vue';

import db from '@/assets/ts/database/database';
import utils from '@/assets/ts/utils';
import type { Note, User } from '@/assets/ts/type';
import { stats, isLoaded } from '@/components/Markdown/Function/Stats';
import { editor } from '@/components/Markdown/Editor';


import pinFull from '/assets/webp/pin_plein.webp?url';
import pinEmpty from '/assets/webp/pin_vide.webp?url';
import { api_url } from '@/assets/ts/backend_link';
import Popup from '@/components/popup/Popup.vue';
import Share_menu from '@/components/popup/share_menu.vue';
import RichMarkdownEditor from '@/components/Markdown/RichMarkdownEditor.vue';
import { download } from '@/components/Markdown/Function/Export';

const props = defineProps<{ id: number | 'new' }>()
const { user } = useUser();

let hitbox: boolean;

// Initialisation de la note
const note = ref<Note>({
    title: '',
    content: '',
    pinned: false,
    simply_edit: false,
    date: '',
    id: -1,
    uuid: '',
    tags: []
});

const if_pin_active = ref<boolean>(note.value.pinned);
const if_open_dropdown = ref<boolean>(false);
const export_menu = ref<boolean>(false);
const export_loading = ref<boolean>(false);
const selected_ext = ref<string>('pdf');
const share_menu = ref<boolean>(false);
const showDialog = ref<boolean>(false);
const emojiBtn = ref<HTMLButtonElement | null>(null);
const title = ref<HTMLInputElement | null>(null);
const loaded = ref<boolean>(false);
const shared = ref<boolean>(false);
const users = ref<User[]>([]);

const attrs = useAttrs();
const router = useRouter();
const route = useRoute();

let socket: Socket;


const export_note = async (ext: string): Promise<void> => {
  export_loading.value = true;
  await download({
    format: ext as 'html' | 'pdf',
    title: note.value.title
  }).then(() => {
    export_loading.value = false;
    export_menu.value = false;
  })
}

const getUserByUUID = async (user_id: string, type: 'owner' | 'visitor'): Promise<User> => {
    
    const data = await fetch(`${api_url}/api/user/by/id/${user_id}`, {
        credentials: 'include'
    }).then(res => res.json());
    return { ...data, type };

}

const delete_note = async (state: number): Promise<void> => {
  
  if (state == 1) {
    showDialog.value = true;
  }

  else if (state == 2) {
    await db.delete(note.value.id);
    showDialog.value = false;
  };
  
};

const save_title = () => {
  if (note.value.title) {
    db.saveTitle(note.value.title, Number(props.id));
  }
}

const save_icon = (icon: string) => {
  db.saveIcon(icon, Number(props.id));
}

const change_pin_state = async (): Promise<void> => {
  if_pin_active.value = !if_pin_active.value;
  note.value.pinned = if_pin_active.value;
  await db.togle_pinned(note.value.id);

  router.replace({ 
    query: { 
      ...route.query,
      pinned: if_pin_active.value ? 'true' : 'false'
    }
  });
};

const update_title = () => {
  document.title = `SilverNote - ${note.value.title}`;
}


const wSocket = () => {

    socket = io(api_url, { path: "/socket.io/share" });

    socket.on('connect', () => {
        console.log('WebSocket connecté !');
        socket.emit("join-room", { 
          room: note.value?.uuid, 
          userId: user.value?.id
        });
    });

    socket.on('new_user', async (userId: string) => {

        if (!shared.value) return;

        const user_visitor = await getUserByUUID(userId, 'visitor');
        const user_owner = await getUserByUUID(userId, 'owner');

        if (!user_owner || !user_visitor) return;
        if (users.value.includes(user_visitor)) return;
        if (users.value.includes(user_owner)) return;

        users.value.push(user_visitor);

    })

    socket.on('title-update', async (update: string) => {
        note.value!.title = update;
    })

    socket.on('icon-update', async (update: string) => {
        note.value!.icon = update;
    })

    socket.on('disconnect', () => {
        console.log('WebSocket déconnecté !');
    });

    let onupdate: boolean = false;
    watch(() => note.value?.title, () => {
      if (onupdate) return;
      onupdate = true;

      setTimeout(() => {
        console.log('title update : ', note.value?.title)
        socket.emit('title-update', note.value?.title);
        onupdate = false;
      }, 500);

    })

    watch(() => note.value?.icon, () => {
      socket.emit('icon-update', note.value?.icon);
    })

};


const create_new_note = async () => {

    console.log("Création d'une nouvelle note");

    const newNote = await db.create({
      note: {
        id: -1,
        uuid: '',
        pinned: false,
        simply_edit: false,
        title: note.value.title,
        content: note.value.content,
        date: utils.date(),
        tags: []
      },
      cloud_post: true
    });

    note.value.id = newNote.id;

    await router.replace({
      params: { id: newNote.id },
      query: { ...route.query }
    });

    await nextTick();
    title.value?.focus();

}

const get_existing_note = async () => {

    const noteId = Number(props.id || route.params.id);

    if (!isNaN(noteId) && noteId > 0) {
      const fetchedNote = await db.getNote(noteId);

      if (!fetchedNote) {
        console.warn("Note introuvable:", noteId);
      } else {
        note.value = fetchedNote;
        if_pin_active.value = fetchedNote.pinned;

        // Init websocket
        wSocket();

        // Vérifie le partage
        try {
          const _share = await fetch(`${api_url}/api/share/${fetchedNote.uuid}?passwd=`)
            .then(res => res.json());

          if (_share.success) {
            shared.value = true;

            // Ajoute owner
            users.value.push(await getUserByUUID(_share.user_id, 'owner'));

            // Ajoute les visiteurs
            for (const userId of _share.visitor) {
              if (userId !== _share.user_id) {
                users.value.push(await getUserByUUID(userId, 'visitor'));
              }
            }
          }
        } catch (err) {
          console.error("Erreur lors de la récupération du partage :", err);
        }
      }
    } else if (props.id !== 'new') {
      console.warn("ID de note invalide :", props.id);
    } else {
      console.error("Erreur de chargement de la note.");
    }

}

const init_emoji_picker = () => {

    if (!emojiBtn.value) {
      return console.error("Emoji picker non chargé.");
    }

    const picker = new EmojiButton({
      position: 'bottom-start',
      autoHide: true,
      showPreview: true
    });

    picker.on('emoji', (emoji: { emoji: string; name: string }) => {
      note.value.icon = utils.emojiToBase64(emoji.emoji);
      save_icon(note.value.icon);
    });

    emojiBtn.value.addEventListener('click', () => {
      picker.togglePicker(emojiBtn.value!);
    });

}


// Start
onMounted(async () => {

  try {

    // création d'une nouvelle note
    if (props.id === 'new') {
      await create_new_note();
    }

    // récupération d'une note existante
    await get_existing_note();

    loaded.value = true;

    await nextTick();

    init_emoji_picker();

  } catch (err) {
    console.error("Erreur lors de l'initialisation :", err);
  }

});


onBeforeUnmount(async () => {
  if (note.value.title == '') {
    console.log('Sauvegarde de la note vide')
    socket.emit('title-update', 'Note sans titre');
    db.saveTitle('Note sans titre', note.value.id);
  }
  else
  {
    socket.emit('title-update', note.value?.title);
  }
});


watch(() => note.value.title, () => {

  update_title();
  save_title();

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
