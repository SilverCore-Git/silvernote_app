<script setup lang="ts">

import { Notes } from '@/assets/ts/database/Var';
import BackBtn from '@/components/backBtn.vue';
import { editor } from '@/components/Markdown/Editor';
import RichMarkdownEditor from '@/components/Markdown/RichMarkdownEditor.vue';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import Dropdown from './Dropdown.vue';
import type { User } from '@/assets/ts/type';
import { api_url } from '@/assets/ts/backend_link';
import waitFor from '@/assets/ts/utils/waitFor';
import useEmoji from './composable/useEmoji';
import CreateNewNote from './composable/CreateNewNote';
import { useRoute, useRouter } from 'vue-router';
import database from '@/assets/ts/database/database';
import useToken from '@/composables/useToken';
import { initSocket, socket } from '@/composables/WSocket';
import DesktopAppTitleBar from '@/components/DesktopAppTitleBar.vue';
import isElectron from '@/assets/ts/utils/isElectron';
import { icon, title } from './composable/useTitleIcon';
import PressAndHold from '@/components/PressAndHold.vue';

const props = defineProps<{
  uuid: string;
}>();

const router = useRouter();
const route = useRoute();
const { init_emoji_picker } = useEmoji();

const emojiBtn = ref<HTMLElement | null>(null);
const ShowDropdown = ref<boolean>(false);
const users = ref<User[]>([]);
const shared = ref<boolean | undefined>(undefined);
const isNewNote = ref<boolean>(false);
const notFound = ref<boolean>(false);
const note = computed(() => Notes.value.find(note => note.uuid == props.uuid && props.uuid != 'new'));
const titleRef = ref<HTMLInputElement | undefined>(undefined);
let close: () => void = () => {};

const resizeTitle = () => {
  const el = titleRef.value;
  if (el) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
};

const update_title = () => {
  if (!title.value) return;
  document.title = `${title.value} - Silvernote edit`;
}

const initNewNote = async () => {
  isNewNote.value = true;
  shared.value = false;
  
  const _note = await CreateNewNote();

  router.push({
    params: {
      ...route.params,
      uuid: _note.uuid
    }
  })

}

const initExistingNote = async () => {

  const found = await waitFor(() => note.value !== undefined, 5_000);
  
  if (!found || !note.value) {
    notFound.value = true;
    return;
  }

  isNewNote.value = false;

  const _fetch = await fetch(`${api_url}/api/share/${note.value?.uuid}/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await useToken()}`
    }
  }).then(res => res.json())

  if (!_fetch.success) return shared.value = false;

  shared.value = _fetch.share.uuid === note.value?.uuid

}

const saveNote = async () => {
  
  const index = Notes.value.findIndex(n => n.uuid === props.uuid);

  if (index !== -1)
  {
    Notes.value[index].title = title.value || Notes.value[index].title;
    Notes.value[index].icon = icon.value || Notes.value[index].icon;
  }

  if (note.value?.title == '' && (note.value?.content == '' || note.value?.content == '<p></p>'))
  {
    await database.delete(Notes.value[index].uuid);
    Notes.value = Notes.value.filter(_note => _note.uuid !== Notes.value[index].uuid);
    return;
  }

  await database.update(Notes.value[index]);

}

const setupNote = async () => {

  notFound.value = false;
  
  if (
    title.value !== undefined 
    && icon.value !== undefined
    && note.value
  )
  {
    note.value.title = title.value || '';
    note.value.icon = icon.value || '';
    await saveNote();
  }
  
  // Réinitialiser l'état
  title.value = undefined;
  icon.value = undefined;
  shared.value = undefined;
  isNewNote.value = false;
  
  close();

  if (props.uuid == 'new')
  {
    await initNewNote();
    await waitFor(() => title.value !== undefined, 5_000);
    titleRef.value?.focus();
  }
  else
  {
    await initExistingNote();
    
    if (notFound.value) {
      return;
    }
    
    title.value = note.value?.title || '';
    icon.value = note.value?.icon || '';
  }
  
  const { closeSocket } = initSocket({
    room: props.uuid,
    users,
    icon,
    title,
    userId: window.localStorage.getItem('user_id') || ''
  });
  
  close = closeSocket;
  update_title();

}

watch(() => title.value, update_title);

watch(title, async () => {
  await nextTick();
  resizeTitle();
  init_emoji_picker({
    note,
    icon,
    ref: emojiBtn,
  });
});

onMounted(async () => {
  await setupNote();
  resizeTitle();
});


onUnmounted(async () => {
  
  if (title.value != undefined && icon.value != undefined && note.value)
  {
    note.value.title = title.value || '';
    note.value.icon = icon.value || '';
  }

  await saveNote();
  socket.emit('leave-room', { room: props.uuid });

  title.value = undefined;
  icon.value = undefined;

})

watch(() => props.uuid, async () => {
  await setupNote();
})

</script>

<template>

<div
    class="
        overflow-y-auto fixed
        inset-0 flex flex-col
        h-full w-full overflow-x-hidden
    "
    :style="{ 'view-transition-name': `note-${uuid}` }"
>

  <div
    class="fixed top-0 inset-x-0 bg-(--bg2) z-9999"
  >
    <DesktopAppTitleBar />
  </div>

  <div
    class="fixed z-40 inset-x-0 h-30 pointer-events-none"
    :class="isElectron ? 'top-10' : 'top-0'"
    style="background: linear-gradient(to top, transparent 0%, var(--bg2) 100%);"
  ></div>

  <div>

    <header
      class="
        flex justify-center items-center flex-row
        fixed inset-x-4 z-60
        md:inset-x-[10%] xl:inset-x-[20%]
        2xl:inset-x-[25vw] bg-transparent
      "
      :class="isElectron ? 'top-18' : 'top-8'"
    >

      <div
        class="
            flex justify-between items-center
        "
      >

        <BackBtn />

        <div
          class="flex flex-row gap-4 absolute right-0"
          v-if="note"
        >
          
          <div
            v-if="shared"
            class="flex justify-center items-center flex-row gap-4"
          >

            <div
              class="flex -space-x-3"
            >

              <img
                  v-for="(user, index) in users"
                  :key="index"
                  class="w-8 h-8 rounded-full border border-gray-200"
                  :src="user.imageUrl"
              />

            </div>

          </div>

        
          <button
            class="cursor-pointer text-(--btn) text-3xl"
            v-tooltip="note?.pinned ? 'Désépingler' : 'Épingler'"
            @click="note.pinned = !note.pinned"
          >
            <i 
              class="bi"
              :class="note?.pinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'"
            />
          </button>

          <button
            class="cursor-pointer text-(--btn) text-3xl"
            @click="ShowDropdown = !ShowDropdown"
          >
            <i class="bi bi-three-dots-vertical" />
          </button>

          <div class="z-60">

            <Dropdown
              v-model:visible="ShowDropdown"
              :note="note"
              :uuid="props.uuid"
            />

          </div>


        </div>

      </div>

    </header>

    <div 
      class="absolute inset-0 z-50" 
      @click="ShowDropdown = false"
      v-if="ShowDropdown"
    />

    <div
      class="
        flex flex-col justify-start items-center 
        overflow-hidden w-screen
      "
      :class="isElectron ? 'mt-30' : 'mt-22'"
    >

      <div
        class="
            flex flex-col justify-start items-center 
            md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw]
            2xl:max-w-[40vw] max-w-[90%] w-full h-full
        "
      >

        <div
          class="w-full h-full flex justify-center items-center"
          v-if="note"
        >

          <div 
            class="flex w-[90%] mb-2 items-end justify-start gap-2"
          >

            <a ref="emojiBtn" class="px-1">

              <div v-if="icon && icon !== ''" >
                <PressAndHold @long-press="icon = ''">
                  <img
                    class="w-20 h-20 p-2 cursor-pointer" 
                    :src="icon" 
                  />
                </PressAndHold>
              </div>

              <span
                v-else
                class="px-1"
              >
                Ajouter une icon
              </span>

            </a>
          
          </div>

        </div>

        <div
          v-if="note"
          class="w-full h-full flex justify-center items-center flex-col"
        >

          <textarea 
            v-if="title !== undefined"
            ref="titleRef"
            v-model="title"
            class="
              text-4xl font-extrabold mb-4 
              text-(--text-strong) w-[90%]
              outline-0 resize-none
              overflow-hidden bg-transparent
              min-h-[1.2em]
            "
            placeholder="Titre..." 
            rows="1"
            @keydown.enter.prevent="editor?.commands.focus()"
          />

          <RichMarkdownEditor
            v-if="note && (shared !== undefined || isNewNote)"
            :editable="true"
            :id="-2" 
            :uuid="note.uuid"
            :data="note"
            :is-collaborative="shared || false"
          />

          <div
            v-if="editor"
            ref=""
            class="
              h-150 w-full
            "
            @click="editor.commands.focus('end');"
          ></div>

        </div>

        <div
          v-else-if="notFound"
          class="
            flex flex-col justify-center items-center
            h-full w-full gap-8 mt-20
          "
        >

          <div class="text-center flex flex-col justify-center items-center">
        
            <div class="text-8xl font-bold text-(--btn) mb-4">404</div>
            <div class="text-3xl font-bold text-(--text-strong) mb-2">Note introuvable</div>
            <div class="text-(--text) text-lg max-w-md">
              Oups ! La note que vous cherchez n'existe pas ou a été supprimée.
            </div>

            <button 
              @click.stop="router.push('/edit/new')"
              class="mt-8 premium gap-2"
            >
              <i class="bi bi-plus-lg" />
              Créer une note
            </button>
        
          </div>
          
        </div>

      </div>

    </div>

  </div>

</div>

</template>
