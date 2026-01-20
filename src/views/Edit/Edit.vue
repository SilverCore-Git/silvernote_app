<script setup lang="ts">

import { Notes, Tags } from '@/assets/ts/database/Var';
import BackBtn from '@/components/backBtn.vue';
import { editor } from '@/components/Markdown/Editor';
import RichMarkdownEditor from '@/components/Markdown/RichMarkdownEditor.vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Dropdown from './Dropdown.vue';
import type { Note, Tag, User } from '@/assets/ts/type';
import { api_url } from '@/assets/ts/backend_link';
import waitFor from '@/assets/ts/utils/waitFor';
import useEmoji from './composable/useEmoji';
import CreateNewNote from './composable/CreateNewNote';
import { useRoute, useRouter } from 'vue-router';
import database from '@/assets/ts/database/database';
import useToken from '@/composables/useToken';
import { initSocket } from '@/composables/WSocket';

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
const hide8moreTags = ref<boolean>(true);
const note = computed(() => Notes.value.find(note => note.uuid === props.uuid));
const titleRef = ref<HTMLInputElement | undefined>(undefined);
const title = ref<string | undefined>(undefined);
const icon = ref<string | undefined>(undefined);
let close: () => void = () => {};


const update_title = () => {
  if (!title.value) return;
  document.title = `${title.value} - Silvernote edit`;
}

const initNewNote = async () => {
  
  const _note = await CreateNewNote();

  router.push({
    params: {
      ...route.params,
      uuid: _note.uuid
    }
  })

}

const initExistingNote = async () => {

  await waitFor(() => note.value !== undefined, 5_000);

  const _fetch = await fetch(`${api_url}/api/share/${note.value?.uuid}/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await useToken()}`
    }
  }).then(res => res.json())

  shared.value = _fetch.share.uuid === note.value?.uuid

}


watch(() => title.value, update_title);


onMounted(async () => {


  if (props.uuid == 'new')
  {
    await initNewNote(); 
    await waitFor(() => titleRef.value !== undefined, 5_000);
    titleRef.value?.focus();
  }
  else
  {
    await initExistingNote();
  }

  title.value = note.value?.title;
  icon.value = note.value?.icon;

  const { closeSocket } = initSocket({
    room: props.uuid,
    users,
    icon,
    title,
    userId: window.localStorage.getItem('user_id') || ''
  })

  close = closeSocket;

  init_emoji_picker({
    note,
    icon,
    ref: emojiBtn,
  });
  update_title();

})

onBeforeUnmount(async () => {

  if (title.value != undefined && icon.value != undefined && note.value)
  {
    note.value.title = title.value;
    note.value.icon = icon.value;
  }

  if (note.value?.title == '')
  {
    note.value.title = 'Note sans nom';
  }

  await database.update(note.value as Note);

})

watch(() => props.uuid, async () => {

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
  }

})

</script>

<template>

  <div
    class="fixed z-40 inset-x-0 top-0 h-30 pointer-events-none"
    style="background: linear-gradient(to top, transparent 0%, var(--bg2) 100%);"
  ></div>


  <header
    class="
      flex justify-center items-center flex-row
      fixed inset-x-4 top-8 z-50 
      md:inset-x-[10%] xl:inset-x-[20%]
      2xl:inset-x-[25vw]
    "
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

      
        <div
          class="cursor-pointer text-(--btn) text-3xl"
          v-tooltip="note?.pinned ? 'Désépingler' : 'Épingler'"
          @click="note.pinned = !note.pinned"
        >
          <i 
            class="bi"
            :class="note?.pinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'"
          />
        </div>

        <div
          class="cursor-pointer text-(--btn) text-3xl"
          @click="ShowDropdown = !ShowDropdown"
        >
          <i class="bi bi-three-dots-vertical" />
        </div>

        <div>
          <Dropdown
            v-model:visible="ShowDropdown"
            :note="note"
            :uuid="props.uuid"
          />
          <Teleport to="body">
            <div 
              class="absolute inset-0 " 
              @click="ShowDropdown = false"
              v-if="ShowDropdown"
            />
          </Teleport>
        </div>


      </div>

  </div>

  </header>

  <div
    class="
      flex flex-col justify-start items-center 
      overflow-hidden w-screen mt-22
    "
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
        v-if="note && note.tags"
      >

        <div 
          class="flex w-[90%] mb-2 items-end"
          :class="
            note?.icon && Tags.filter((tag: Tag) => note?.tags.includes(tag.id))[0] 
              ? 'justify-between' 
              : 'justify-start gap-2'
          "  
        >

          <button ref="emojiBtn"><a>

            <img
              v-if="icon" 
              class="w-20 h-20 p-2 cursor-pointer" 
              :src="icon" 
            />

            <a 
              v-else
              class="px-1"
            >
              Ajouter une icon
            </a>

          </a></button>

          <div
            v-if="note.tags.length > 0"
            class="flex flex-col items-center max-w-80 w-full"
          >

            <span class="text-lg font-semibold tracking-wide mb-1">Tags</span>

            <ul class="flex flex-wrap justify-center gap-2 max-w-80">
              <li
                v-for="
                  tag in hide8moreTags
                    ? Tags.filter((t: any) => note?.tags.includes(t.id)).slice(0, 7)
                    : Tags.filter((t: any) => note?.tags.includes(t.id))
                "
                :key="tag.id"
                :style="{ backgroundColor: tag.color }"
                class="px-2.5 py-1 rounded-lg text-white border text-sm shadow-sm"
              >
                {{ tag.name }}
              </li>

              <li
                v-if="hide8moreTags && note.tags.length > 7"
                class="px-2.5 py-1 rounded-lg text-sm font-bold bg-(--bg2)"
              >
                ...
              </li>
            </ul>

            <button
              v-if="note.tags.length > 7"
              @click="hide8moreTags = !hide8moreTags"
              class="mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {{ hide8moreTags ? 'Voir plus' : 'Voir moins' }}
            </button>

          </div>

          <!-- <div
            v-else
            @click="tagManager = true"
          >
            <a class="px-1">Ajouter un tag</a>
          </div> -->
        
        </div>

      </div>

      <div
        class="w-full h-full flex justify-center items-center flex-col"
      >

        <input 
          v-if="title != undefined"
          class="
            text-4xl font-extrabold mb-4 
            text-(--text-strong) w-[90%]
            outline-0
          " 
          type="text" 
          placeholder="Titre..." 
          ref="titleRef"
          v-model="title"
          @keydown.enter="editor?.commands.focus()"
        />

        <RichMarkdownEditor
          v-if="note && shared != undefined"
          :editable="true"
          :id="-2" 
          :uuid="note.uuid"
          :data="note"
        />

      </div>

    </div>

  </div>

</template>
