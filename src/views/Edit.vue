<template>

  <div
    class="fixed z-40 inset-x-0 top-0 h-30 pointer-events-none"
    style="background: linear-gradient(to top, transparent 0%, var(--bg2) 100%);"
  ></div>

  <header 
    class="
          flex flex-row fixed inset-x-0 mx-[var(--mrl)]
          pt-2 z-50 mt-5
          "
  >

    <div 
      class="left-arrow absolute left-0 cursor-pointer" 
      @click="router.push('/')" 
      :class="hitbox ? 'bg-red-600' : ''"
    ></div>

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
        class="absolute inset-0 pointer-events-auto"
        @click="if_open_dropdown = false"
      >

        <div 
          class="dropdown absolute right-0 "
          :style="{ top: `calc(3.4rem + env(safe-area-inset-top))` }"
        >

          <ul>

            <li v-if="editor" @click="()=> editor?.chain().focus().undo().run()">Annuler</li>
            <li v-if="editor" @click="()=> editor?.chain().focus().redo().run()">Rétablir</li>
            <li v-if="editor" @click="showSearchBar">Rechercher</li>

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
    class="flex flex-col justify-start items-center h-full mx-auto
          mt-12 overflow-x-hidden overflow-y-scroll max-w-3xl"
  >

    <div 
      class="flex w-[90%] mb-2 items-end"
      :class="
        note.icon && all_tags.filter(tag => note.tags.includes(tag.id))[0] 
          ? 'justify-between' 
          : 'justify-start gap-2'
      "  
    >

      <button ref="emojiBtn"><a>

        <img
          v-if="note.icon" 
          class="w-[80px] h-[80px] p-2 cursor-pointer" 
          :src="note.icon" 
        />

        <a 
          v-else
          class="px-1"
        >
          Ajouter une icon
        </a>

      </a></button>

      <div 
        v-if="all_tags.filter(tag => note.tags.includes(tag.id))[0]"
        class="flex justify-center items-center flex-col max-w-80 relative p-4 rounded"
      >

        <span class="text-lg font-bold mb-4">Dossiers</span>

        <ul class="flex flex-wrap gap-2 max-w-80">

          <li
            v-for="
              tag in hide8moreTags 
                ? all_tags.filter(tag => note.tags.includes(tag.id)).slice(0, 7) 
                : all_tags.filter(tag => note.tags.includes(tag.id))
            "
            :key="tag.id"
            :style="{ backgroundColor: tag.color }"
            class="px-2 py-0.5 rounded text-white border text-sm"
          >
            {{ tag.name }}
          </li>

          <li
            v-if="hide8moreTags"
            class="px-2 py-0.5 rounded text-sm font-bold"
          >
            ...
          </li>

        </ul>

        <a
          @click="hide8moreTags = !hide8moreTags"
          class="cursor-pointer mt-2 select-none"
        >
          {{ hide8moreTags ? 'voir plus' : 'voir moins' }}
        </a>

      </div>

      <div
        v-else
      >
        <a class="px-1">Ajouter un tag</a>
      </div>
    
    </div>

    <input 
      v-if="loaded"
      class="text-4xl font-extrabold mb-4 text-[var(--text-strong)]" 
      type="text" 
      placeholder="Titre..." 
      ref="title"
      v-model="note.title"
      @keydown.enter="editor?.commands.focus()"
    />

    <div 
      v-else
      class="text-3xl mb-3 font-bold animate-pulse bg-gray-300 h-10 w-[90%] rounded-xl" 
    ></div>

    
    <RichMarkdownEditor 
      v-if="loaded"
      v-bind="attrs" 
      :editable="true"
      :id="-2" 
      :uuid="note.uuid"
      :data="note"
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
import { Tags as all_tags } from '@/assets/ts/database/Var'; 
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
import { showSearchBar } from '@/components/Markdown/tiptap-extensions/searchAndReplace';
import ConfirmDialog from '@/components/popup/ConfirmDialog.vue';

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

const hide8moreTags = ref<boolean>(true);
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
    id: note.value.id
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
    router.push('/');
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

    socket = io(
      api_url == 'http://localhost:3000'
        ? 'http://localhost:3434'
        : api_url, 
      { path: "/socket.io/share" }
    );

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

        if (!users.value.includes(user_visitor) && !users.value.includes(user_owner)) 
        {
          users.value.push(user_visitor);
        }

    })

    let ignoreNextUpdate: boolean = false;
    socket.on('title-update', (update: string) => {
      ignoreNextUpdate = true;
      if (note.value) note.value.title = update;
    });

    socket.on('icon-update', async (update: string) => {
        note.value!.icon = update;
    })

    socket.on('disconnect', () => {
        console.log('WebSocket déconnecté !');
    });

    watch(
      () => note.value?.title,
      (newTitle) => {

        if (ignoreNextUpdate) {
          ignoreNextUpdate = false;
          return;
        }

        debounceEmit(newTitle);

      }
    );

    let timeout: any;
    function debounceEmit(title?: string) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        socket.emit('title-update', title);
      }, 500);
    }

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
    setTimeout(() => title.value?.focus(), 200);

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
      showPreview: true,
      i18n: {
        search: 'Rechercher...',
        categories: {
          recents: 'Récents',
          smileys: 'Émoticônes et émotions',
          people: 'Personnes et corps',
          animals: 'Animaux et nature',
          food: 'Nourriture et boissons',
          activities: 'Activités',
          travel: 'Voyages et lieux',
          objects: 'Objets',
          symbols: 'Symboles',
          flags: 'Drapeaux',
          custom: 'Personnalisé',
        },
        notFound: 'Aucun emoji trouvé',
      },
      custom: [
        { name: "test", emoji: "data:image/png;base64,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" }
      ]
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
