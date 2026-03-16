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
import { useRoute, useRouter } from 'vue-router';
import getToken from '@/composables/useToken';
import { api_url } from '@/assets/ts/backend_link';
import ShareDropdown from '../Share/components/dropdown.vue';
import Popup from '@/components/popup/Popup.vue';


const props = defineProps<{
  uuid: string;
}>();


const route = useRoute();
const router = useRouter();

const shareData = ref<any>(null);
const shared = computed<boolean>(() => route.name == 'Share');
const passwd = ref<string | 'done'>('');

const noteId = computed(() => props.uuid);
const { localNote } = useNoteEditing(noteId, shared);
const { init_emoji_picker } = useEmoji();

const error = ref<string>('');
const emojiBtn = ref<HTMLElement | null>(null);
const ShowDropdown = ref<boolean>(false);
const titleRef = ref<HTMLInputElement | undefined>(undefined);


const imTheOwner = computed(() => {
  if (!shared.value || !shareData.value) return false;
  return shareData.value.owner_id === localStorage.getItem('user_id');
});

const users = computed<User[]>(() => {
  if (!shareData.value) return [];
  return shareData.value.visitor;
});

const needPasswd = computed<boolean>(() => {
  if (!shared.value || !shareData.value) return false;
  return shareData.value?.need == 'passwd';
});


const share_menu = ref<boolean>(false);


const resizeTitle = () => {
  const el = titleRef.value;
  if (el) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
};


const loadShareInfo = async () => {
  
  try {

    const token = await getToken();
    const res = await fetch(`${api_url}/api/share/${props.uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) return;
    shareData.value = await res.json();

  } 
  catch (e) 
  {
    console.error("Erreur share info:", e);
  }

};


const verifyPasswd = async () => {

  try {

    const token = await getToken();
    const res = await fetch(`${api_url}/api/share/${props.uuid}?passwd=${passwd.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.ok) 
    {
      await loadShareInfo();
    } 
    else 
    {
      error.value = "Mot de passe incorrect.";
    }

  } 
  catch (e) 
  {
    console.error("Erreur vérification mot de passe:", e);
    error.value = "Une erreur est survenue. Veuillez réessayer.";
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

      titleRef.value?.focus();

    }

  }, { immediate: true });

  await loadShareInfo();

});

</script>

<template>

<div v-if="shared">

  <Popup v-model:visible="needPasswd">

      <div @click.stop class="w-full max-w-sm p-2">
          
          <div class="flex flex-col items-center mb-8">

              <div class="w-16 h-16 bg-(--btn)/10 rounded-full flex items-center justify-center mb-4">
                  <i class="bi bi-shield-lock-fill text-3xl text-(--btn)" />
              </div>

              <h2 class="text-2xl font-bold text-(--text-strong)">Note protégée</h2>

              <p class="text-sm text-(--text-little) text-center mt-1">
                  Cette note est privée. Veuillez saisir le mot de passe pour y accéder.
              </p>

          </div>

          <div class="flex flex-col gap-4">

              <div class="relative group">

                  <input
                      v-model="passwd"
                      type="password"
                      placeholder="Mot de passe"
                      class="
                        w-full px-5 py-4 rounded-2xl 
                        bg-(--bg2)/50 border-2 
                        border-transparent focus:border-(--btn)/50 
                        focus:bg-(--bg2) outline-none transition-all 
                        duration-300 placeholder:text-(--text-little)/50
                      "
                      @keydown.enter="verifyPasswd"
                  />

                  <div 
                    class="
                      absolute inset-0 rounded-2xl pointer-events-none 
                      group-focus-within:ring-4 ring-(--btn)/5 transition-all
                    "
                  />

              </div>

              <transition name="fade">
                  <div v-if="error" class="flex items-center gap-2 px-2 text-red-400 text-sm">
                      <i class="bi bi-exclamation-circle-fill" />
                      <span>{{ error }}</span>
                  </div>
              </transition>

              <div class="grid grid-cols-2 gap-3 mt-4">

                  <button
                      class="default"
                      @click="router.push('/')"
                  >
                      Annuler
                  </button>

                  <button
                      class="primary gap-2"
                      @click="verifyPasswd"
                  >
                      <span>Accéder</span>
                      <i class="bi bi-arrow-right-short text-xl" />
                  </button>

              </div>

          </div>

      </div>

  </Popup>

</div>

<div
    v-if="!needPasswd"
    class="
        overflow-y-auto fixed
        inset-0 flex flex-col bg-(--bg)
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
          class="flex flex-row gap-6 absolute right-0"
        >
          
          <div
            v-if="shareData && shareData?.visitor.length > 0"
            class="flex justify-center items-center flex-row gap-6"
          >

            <div
              class="flex -space-x-3"
            >

              <img
                  v-for="(user, index) in users"
                  :key="'visitor-'+index"
                  class="w-8 h-8 rounded-full border border-(--text)/10"
                  :src="user.imageUrl"
              />

            </div>

            <button
                class="px-2 default-primary"
                :class="share_menu ? 'bg-(--text)/10' : ''"
                @click="share_menu = !share_menu"
            >
                Partage
            </button>

          </div>

          <transition name="fade-slide">
                        
            <ShareDropdown
                v-if="share_menu"
                @click="share_menu = false"
                :users="users"
                :send_share="() => {}"
            />
                    
          </transition>

        
          <button
            v-if="!shared || shared && imTheOwner"
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
            v-if="!shared || shared && imTheOwner"
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

          <div v-if="shared && !shareData?.editable" class="p-2">

            <div v-if="localNote.icon">

              <img 
                class="w-20 h-20 " 
                :src="localNote.icon" 
              />

            </div>

          </div>

          <a v-else ref="emojiBtn" class="p-2 px-2">

            <div v-if="localNote.icon">

              <PressAndHold @long-press="localNote.icon = ''">

                <img 
                  class="w-20 h-20  cursor-pointer hover:scale-110 transition-transform" 
                  :src="localNote.icon" 
                />

              </PressAndHold>

            </div>

            <div
              v-else
            >

              <span>Ajouter une icône</span>

            </div>

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
            :disabled="shared ? !shareData?.editable : false"
            @keydown.enter.prevent="editor?.commands.focus()"
          />

          <RichMarkdownEditor
            :editable="shared ? shareData?.editable : true" 
            :uuid="localNote.id"
            :shared="shared"
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
        <i>Chargement...</i>
      </div>

    </div>

  </div>

</div>



</template>
