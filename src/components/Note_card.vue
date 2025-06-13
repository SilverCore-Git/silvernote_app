<template>

  <div
    class="note-card bg-[#FFF8F0] text-[#3B3B3B] p-3 border-[#3B3B3B]
          mr-4 ml-4 md:mr-2 md:ml-2 border-2 relative cursor-pointer mb-4 md:h-[28vh]"
    style="border-radius: 15px;"
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
            class=" absolute top-7 right-0 
                    bg-[#FFF8F0] border-[#3B3B3B] 
                    border-t-0 border-1
                    p-2 pr-3 pl-3 
                    min-w-full min-h-full z-30
                  "
            style="border-radius: 10px; border-top-left-radius: 20px; border-top-right-radius: 0px;"
            v-if="dropdown"
          >

            <ul>

              <li @click.stop="() => { manage_tags = true; dropdown = false; }" :class="hitbox ? 'bg-teal-600 border-1 border-black' : ''" >Dossiers</li>
              <li @click.stop="share=!share"   :class="hitbox ? 'bg-teal-600 border-1 border-black' : ''" >Partager</li>
              <li @click.stop="delete_note(1)" class="text-red-600" :class="hitbox ? 'bg-teal-600 border-1 border-black' : ''" >Supprimer</li>

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
      class="text-mb mb-3 w-[65%] whitespace-nowrap md:whitespace-normal overflow-hidden text-ellipsis"
      :class="hitbox ? 'bg-blue-500' : ''"
    >
      {{ utils.htmlToText(content) }}
    </p>

    <div class="absolute left-1 bottom-1 w-[60%] whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none">
      <span v-for="(tag, index) in Tags" :key="index" class="ml-2 underline" :class="hitbox ? 'bg-teal-500' : ''">{{ tag.name }}</span>
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
};

const onTagsUpdate = (newTags: number[]) => {
  db.saveTags(newTags, props.id);
  window.location.reload();
};


const delete_note = async (state: number): Promise<void> => {
  
  if (state == 1) {
    showDialog.value = true;
  }

  else if (state == 2) {
    await db.delete(props.id);
  };
  //await db.delete(props.id);
};

const open_note = () => {
  router.push(`/edit?id=${props.id}&pinned=${if_pin_active.value}&simply_edit=${props.simply_edit}`)
};

onMounted(async () => {
  all_tags.value = await db.getAll('tags');
  Tags.value = all_tags.value.filter(tag => props.tags.includes(tag.id));
});

watch(() => props.pinned, (newVal) => {
  if_pin_active.value = newVal
});

const handleClickOutside = (event: MouseEvent) => {
  if (dropdown_rootRef.value && !dropdown_rootRef.value.contains(event.target as Node)) {
    dropdown.value = false;
  }
  if (share.value) {
    share.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<style scoped>

.bin {
    width: 30px;
    height: 30px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/assets/svgs/bin.svg');
    filter: invert(55%) sepia(79%) saturate(558%) hue-rotate(342deg) brightness(93%) contrast(89%);
    transition: all 0.3s ease;
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
