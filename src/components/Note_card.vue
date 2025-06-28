<template>

  <div
    class="note-card min-w-60 bg-[var(--bg2)] text-[var(--text)] p-3 border-[var(--text)]
            border-2 relative cursor-pointer md:h-[28vh]"
    style="border-radius: var(--br-card);"
    @click="open_note"
  > 
  
    <p class="font-bold text-xl w-[80%] whitespace-nowrap overflow-hidden text-ellipsis" :class="hitbox ? 'bg-teal-500' : ''">{{ utils.htmlToText(title) }}</p>

    <div class="absolute right-0 top-3 h-full flex flex-row-reverse gap-1.5">

      <div 
        ref="dropdown_rootRef" 
        class="relative"
        @click.stop="dropdown = !dropdown"
      >

        <div
          class="ellipsis"
          :class="hitbox ? 'bg-red-600' : ''"
        ></div>

        <transition name="fade-slide">
 
          <div 
            class=" absolute top-8 right-0
                    bg-[var(--bg2)] border-[var(--text)] 
                    border-t-0 border-1
                    p-2 pr-3 pl-3 z-30
                  "
            style="border-radius: var(--br-card); border-top-left-radius: 20px; border-top-right-radius: 0px;"
            v-if="dropdown"
          >

            <ul>

              <li 
                class="flex flex-row"
                @click.stop="() => { manage_tags = true; dropdown = false; }" 
                :class="hitbox ? 'bg-teal-600 border-1 border-black' : ''" 
              >
                <div >
                  <svg class="dropdown-svg" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H9.67452C10.1637 5 10.4083 5 10.6385 5.05526C10.8425 5.10425 11.0376 5.18506 11.2166 5.29472C11.4184 5.4184 11.5914 5.59135 11.9373 5.93726L12.0627 6.06274C12.4086 6.40865 12.5816 6.5816 12.7834 6.70528C12.9624 6.81494 13.1575 6.89575 13.3615 6.94474C13.5917 7 13.8363 7 14.3255 7H17.8C18.9201 7 19.4802 7 19.908 7.21799C20.2843 7.40973 20.5903 7.71569 20.782 8.09202C21 8.51984 21 9.0799 21 10.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>dossiers
              </li>
              <li 
                class="flex flex-row"
                @click.stop="share_it()"   
                :class="hitbox ? 'bg-teal-600 border-1 border-black' : ''" 
              >
                <div>
                  <svg class="dropdown-svg" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M15.75 5.125a3.125 3.125 0 1 1 .754 2.035l-8.397 3.9a3.124 3.124 0 0 1 0 1.88l8.397 3.9a3.125 3.125 0 1 1-.61 1.095l-8.397-3.9a3.125 3.125 0 1 1 0-4.07l8.397-3.9a3.125 3.125 0 0 1-.144-.94Z"
                    />
                  </svg>
                </div>partager
              </li>
              <li 
                @click.stop="delete_note(1)" class="text-red-600 flex flex-row" 
                :class="hitbox ? 'bg-teal-600 border-1 border-black' : ''" 
              >
                <div class="dropdown-svg bin"></div>supprimer
              </li>

            </ul>

          </div>

        </transition>

      </div>

      <!-- <div
        class="bin"
        @click.stop=""
      ></div> -->

      <div
        class="pin"
        :style="{
          backgroundImage: if_pin_active
            ? `url(${pinFull})`
            : `url(${pinEmpty})`,
        }"
        @click.stop="change_pin_state"
        :class="hitbox ? 'bg-red-600' : ''"
      ></div>

    </div>

    <p 
      class="text-mb mb-5 w-[65%] h-[80%] whitespace-nowrap md:whitespace-normal overflow-hidden text-ellipsis"
      :class="hitbox ? 'bg-blue-500' : ''"
    >
      {{ utils.htmlToText(content) }}
    </p>

    <div class="absolute left-1 bottom-1 max-w-[60%] overflow-scroll whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none">
      <span v-for="(tag, index) in Tags" :key="index" class="ml-2 border-1 border-[var(--text)] pr-1.5 pl-1.5 rounded-[var(--br-tag)]" :style="{ backgroundColor: tag.color, color: utils.get_text_color(tag.color) }" :class="hitbox ? 'bg-teal-500' : ''">{{ tag.name }}</span>
    </div>
    <label class="absolute right-2 bottom-1 z-10" :class="hitbox ? 'bg-teal-500' : ''">{{ date }}</label>

  </div>

  <ConfirmDialog
    :visible="showDialog"
    title="Confirmation"
    message="Voulez-vous vraiment supprimer cette note ?"
    @confirm="delete_note(2)"
    @cancel="showDialog = false"
  />

  <share_menu
    :visible="share" 
    :title="title"
    :content="content"
  />

  <Tags_manager
    :active="manage_tags"
    :tags="tags"
    @update:tags="onTagsUpdate"
    @update:active="manage_tags = $event"
  />

</template>

<script setup lang="ts">

import { onMounted, onUnmounted, ref, watch, defineProps } from 'vue';
import { useRouter } from 'vue-router';

import ConfirmDialog from './ConfirmDialog.vue';
import share_menu from './share_menu.vue';
import Tags_manager from './tags_manager.vue';

import db from '../assets/ts/database';
import utils from '../assets/ts/utils';
import type { Tag } from '../assets/ts/type';
import { hitbox as if_hitbox } from '../assets/ts/settings';

let hitbox: boolean;
onMounted(async () => { hitbox = await if_hitbox() })

import pinFull from '/assets/webp/pin_plein.webp?url';
import pinEmpty from '/assets/webp/pin_vide.webp?url';

const router = useRouter()

const emit = defineEmits(['pin']);
const props = defineProps<{
  title: string
  content: string
  date: string
  pinned: boolean
  tags: number[]
  simply_edit: boolean
  id: number
}>()

const showDialog = ref<boolean>(false);
const if_pin_active = ref<boolean>(props.pinned)
const share = ref<boolean>(false);
const manage_tags = ref<boolean>(false);

const all_tags = ref<Tag[]>([]);
const Tags = ref<Tag[]>([]);

const dropdown = ref<boolean>(false);
const dropdown_rootRef = ref<HTMLElement | null>(null);


const change_pin_state = async () => {
  await db.togle_pinned(props.id);
  if_pin_active.value = !if_pin_active.value;
  emit('pin', true)
};

const onTagsUpdate = (newTags: number[]) => {
  db.saveTags(newTags, props.id);
};

const share_it = async () => {

  if (navigator.share) {

      try {

        await navigator.share({
          title: props.title,
          text: props.content,
          url: window.location.href,
        });

        console.log('Partagé avec succès');

      } catch (err) {

        console.error('Erreur de partage', err);

      }

  }

  else {
    share.value = !share.value;
  }

}

const delete_note = async (state: number): Promise<void> => {
  
  if (state == 1) {
    showDialog.value = true;
  }

  else if (state == 2) {
    await db.delete(props.id);
    showDialog.value = false;
  };
  //await db.delete(props.id);
};

const open_note = () => {
  router.push(`/edit?id=${props.id}&pinned=${if_pin_active.value}&simply_edit=${props.simply_edit}`)
};

onMounted(async () => {
  all_tags.value = await db.getAll('tags');
  Tags.value = all_tags.value.filter(tag => props.tags.includes(tag.id));
})

watch(() => props.pinned, (newVal) => {
  if_pin_active.value = newVal
})

const handleClickOutside = (event: MouseEvent) => {
  if (dropdown_rootRef.value && !dropdown_rootRef.value.contains(event.target as Node)) {
    dropdown.value = false;
  }
  if (share.value) {
    share.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
})

watch(Tags, async() => {
  all_tags.value = await db.getAll('tags');
  Tags.value = all_tags.value.filter(tag => props.tags.includes(tag.id));
})

const theme = ref<string | null>(localStorage.getItem('theme'));

watch(theme, () => {
  if (theme.value == 'dark') {
    const elements = document.getElementsByClassName('folder-svg');

    Array.from(elements).forEach((el) => {
      el.classList.add('dark');
    });
  }
})


</script>


<style scoped>

.note-card {
  transition: all 0.3s ease;
}

.note-card:hover {
  box-shadow: 0 0 10px color-mix(in srgb, var(--btn) 50%, transparent);
}

.folder-svg {
  background-image: url('../assets/svgs/folder.svg');
}

.dropdown-svg {
  width: 18px;
  height: 18px;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 5px;
  transform: translateY(4px);
}

.bin {
  background-image: url('/assets/svgs/bin.svg');
  filter: brightness(0) saturate(100%) invert(19%) sepia(94%) saturate(7458%) hue-rotate(359deg) brightness(94%) contrast(112%);
}

.ellipsis {
    width: 30px;
    height: 30px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/assets/svgs/ellipsis.svg');
    filter: invert(55%) sepia(79%) saturate(558%) hue-rotate(342deg) brightness(93%) contrast(89%);
    transition: all 0.3s ease;
}

.pin {
  width: 25px;
  height: 25px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}



    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .fade-slide-enter-from,
    .fade-slide-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }

    .fade-slide-enter-to,
    .fade-slide-leave-from {
        opacity: 1;
        transform: translateY(0);
    }

</style>
