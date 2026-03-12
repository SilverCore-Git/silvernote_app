<script setup lang="ts">

import BackBtn from '@/components/backBtn.vue';
import { editor } from '@/components/Markdown/Editor';
import RichMarkdownEditor from '@/components/Markdown/RichMarkdownEditor.vue';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import Dropdown from './Dropdown.vue';
import type { User } from '@/assets/ts/type';
import useEmoji from './composable/useEmoji';
import DesktopAppTitleBar from '@/components/DesktopAppTitleBar.vue';
import isElectron from '@/assets/ts/utils/isElectron';
import PressAndHold from '@/components/PressAndHold.vue';
import useNoteEditing from '@/composables/useNoteEditing';


const props = defineProps<{
  uuid: string;
}>();


const noteId = computed(() => props.uuid);
const { localNote } = useNoteEditing(noteId);
const { init_emoji_picker } = useEmoji();


const emojiBtn = ref<HTMLElement | null>(null);
const ShowDropdown = ref<boolean>(false);
const users = ref<User[]>([]); // a faire
const shared = ref<boolean | undefined>(undefined);
const titleRef = ref<HTMLInputElement | undefined>(undefined);

const resizeTitle = () => {
  const el = titleRef.value;
  if (el) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
};


watch(() => localNote.value.title, async () => {
  await nextTick();
  resizeTitle();
});

onMounted(async () => {
  
  watch(() => localNote.value.loaded, async (loaded) => {

    if (loaded) 
    {

      await nextTick();
      resizeTitle();

      init_emoji_picker({
        note: localNote,
        ref: emojiBtn,
      });

    }

  }, { immediate: true });

});

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
      v-if="localNote.loaded"
    >

      <div
        class="
            flex justify-between items-center
        "
      >

        <BackBtn />

        <div
          class="flex flex-row gap-4 absolute right-0"
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
            v-tooltip="localNote.pinned ? 'Désépingler' : 'Épingler'"
            @click="localNote.pinned = !localNote.pinned"
          >
            <i 
              class="bi"
              :class="localNote.pinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'"
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
        v-if="localNote.loaded"
      >

        <div
          class="w-full h-full flex justify-center items-center"
        >

          <div 
            class="flex w-[90%] mb-2 items-end justify-start gap-2"
          >

            <a ref="emojiBtn" class="px-1">

              <div v-if="localNote.icon && localNote.icon !== ''" >
                <PressAndHold @long-press="localNote.icon = ''">
                  <img
                    class="w-20 h-20 p-2 cursor-pointer" 
                    :src="localNote.icon" 
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
          class="w-full h-full flex justify-center items-center flex-col"
        >

          <textarea
            ref="titleRef"
            v-model="localNote.title"
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
            :editable="true" 
            :uuid="localNote.id"
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

      </div>

      <div
        class="
            flex flex-col justify-start items-center 
            md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw]
            2xl:max-w-[40vw] max-w-[90%] w-full h-full
        "
        v-else
      >
        loader
      </div>

    </div>

  </div>

</div>

</template>
