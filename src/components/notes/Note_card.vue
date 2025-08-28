<template>

<PressAndHold
  @long-press="select_note()"
  @click.stop="open_note(id, pinned)"
>

  <div
    class="note-card min-w-60 bg-[var(--bg2)] text-[var(--text)] p-3
            border-2 relative cursor-pointer md:h-[28vh]"
    :class="note_settings ? 'border-[var(--btn)]' : 'border-[var(--text)]'"
    style="border-radius: var(--br-card);"    
  > 
  
    <p class="font-bold text-xl w-[80%] whitespace-nowrap overflow-hidden text-ellipsis" :class="hitbox ? 'bg-teal-500' : ''">{{ utils.htmlToText(title) }}</p>

    <div class="absolute right-3 top-3">
      <div
          v-if="pinned"
          class="pin w-7 h-7 md:w-6 md:h-6"
          :style="{
            backgroundImage: `url(${pinFull})`
          }"
      ></div>
    </div>

    <p 
      class="text-[3vw] md:text-lg my-5 md:my-0 w-[65%] h-[80%] whitespace-nowrap md:whitespace-normal overflow-hidden text-ellipsis"
      :class="hitbox ? 'bg-blue-500' : ''"
    >
      {{ utils.htmlToText(content) }}
    </p>

    <div class="absolute left-1 bottom-1 max-w-[60%] overflow-scroll whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none">
      <span v-for="(tag, index) in Tags" :key="index" class="ml-2 border-1 border-[var(--text)] pr-1.5 pl-1.5 rounded-[var(--br-tag)]" :style="{ backgroundColor: tag.color, color: utils.get_text_color(tag.color) }" :class="hitbox ? 'bg-teal-500' : ''">{{ tag.name }}</span>
    </div>
    <label class="absolute right-2 bottom-1 z-10" :class="hitbox ? 'bg-teal-500' : ''">{{ date }}</label>

  </div>

</PressAndHold>

    <Note_settings
      :id="id"
      v-model:visible="note_settings"
      :function_reload="function_reload"
    />

  <ConfirmDialog
    :visible="showDialog"
    title="Confirmation"
    message="Voulez-vous vraiment supprimer cette note ?"
    @confirm="delete_note(2)"
    @cancel="showDialog = false"
  />



</template>

<script setup lang="ts">

import { onMounted, ref, watch, defineProps } from 'vue';
import { useRouter } from 'vue-router';

import ConfirmDialog from '../popup/ConfirmDialog.vue';

import db from '../../assets/ts/database';
import utils from '../../assets/ts/utils';
import type { Tag } from '../../assets/ts/type';
import { hitbox as if_hitbox } from '../../assets/ts/settings';

let hitbox: boolean;
onMounted(async () => { hitbox = await if_hitbox() })

import PressAndHold from '../PressAndHold.vue';
import Note_settings from './Note_Settings.vue';
import pinFull from '/assets/webp/pin_plein.webp?url';


const props = defineProps<{
    title: string;
    content: string;
    date: string;
    pinned: boolean;
    tags: number[];
    simply_edit: boolean;
    id: number;
    uuid: string;
    function_reload: () => Promise<any>;
}>()

const emit = defineEmits(['pin']);
const router = useRouter();

const note_settings = ref<boolean>(false);
const showDialog = ref<boolean>(false);
const if_pin_active = ref<boolean>(props.pinned)
const press_and_hold = ref<boolean>(false);

const all_tags = ref<Tag[]>([]);
const Tags = ref<Tag[]>([]);


const open_note = (id: number, pinned: boolean) => {
    if (press_and_hold.value) return;
    router.push(`/edit/${id}?pinned=${pinned}`);
}


const delete_note = async (state: number): Promise<void> => {
  
  if (state == 1) {
    showDialog.value = true;
  }

  else if (state == 2) {
    await db.delete(props.id);
    showDialog.value = false;
  };
  
};

onMounted(async () => {
  all_tags.value = await db.getAll('tags');
  Tags.value = all_tags.value.filter(tag => props.tags.includes(tag.id));
})

watch(() => props.pinned, (newVal) => {
  if_pin_active.value = newVal
})


const select_note = () => {

    press_and_hold.value = true;
        
    note_settings.value = !note_settings.value;

    setTimeout(() => press_and_hold.value = false, 3000);

}


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

.pin {
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
