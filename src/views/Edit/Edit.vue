<script setup lang="ts">
import { Notes } from '@/assets/ts/database/Var';
import BackBtn from '@/components/backBtn.vue';
import { editor } from '@/components/Markdown/Editor';
import RichMarkdownEditor from '@/components/Markdown/RichMarkdownEditor.vue';
import { computed, onMounted, ref } from 'vue';
import Dropdown from './Dropdown.vue';
import type { User } from '@/assets/ts/type';
import useWSocket from './composable/useWSocket';
import { useUser } from '@clerk/vue';
import { useRouter } from 'vue-router';
import { api_url } from '@/assets/ts/backend_link';
import { useToken } from '@/composables/useToken';
import waitFor from '@/assets/ts/utils/waitFor';

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const { user } = useUser();
const ShowDropdown = ref<boolean>(false);
const users = ref<User[]>([]);
const shared = ref<boolean>(false);
const note = computed(() => Notes.value.find(note => note.id === Number(props.id)));

onMounted(async () => {

  await waitFor(() => note.value !== undefined, 5_000);

  try {

    const _fetch = await fetch(`${api_url}/api/share/${note.value?.uuid}/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await useToken()).token.value}`
      }
    })

    shared.value = (await _fetch.json() as any).share.uuid === note.value?.uuid

    useWSocket({
      note,
      users,
      shared,
      user
    });

  } catch (err) {
    throw new Error(`Erreur lors de la récupération des informations de partage : ${err}`);
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
            :id="props.id"
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
      >

      </div>

      <div
        class="w-full h-full flex justify-center items-center flex-col"
      >

        <input 
          v-if="note"
          class="
            text-4xl font-extrabold mb-4 
            text-(--text-strong) w-[90%]
            outline-0
          " 
          type="text" 
          placeholder="Titre..." 
          ref="title"
          v-model="note.title"
          @keydown.enter="editor?.commands.focus()"
        />

        <RichMarkdownEditor
          v-if="note"
          :editable="true"
          :id="-2" 
          :uuid="note.uuid"
          :data="note"
        />

      </div>

    </div>

  </div>

</template>