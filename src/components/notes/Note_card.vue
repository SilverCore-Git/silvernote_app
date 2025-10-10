<template>

<PressAndHold
  @long-press="select_note()"
  @click.stop="open_note(id, pinned)"
>

  <div
    class="note-card md:min-w-60 bg-[var(--bg2)] text-[var(--text)] p-3
            border-2 relative cursor-pointer h-full min-h-40 select-none"
    :class="note_settings ? 'border-[var(--btn)]' : 'border-[var(--text)]'"
    :style="{ transform: note_settings ? 'scale(1.05)' : '' }"
    style="border-radius: var(--br-card);"    
  > 
  
    <p 
      class="font-bold text-2xl w-full overflow-hidden text-ellipsis uppercase
      flex justify-start items-center flex-row gap-2">
      <img
        v-if="icon" 
        class="w-[32px] h-[32px] cursor-pointer" 
        :src="icon" 
      />
      {{ utils.htmlToText(title) }}
    </p>

    <p 
      class="text-xs my-2
              max-h-50 multiline-8"
    >
      {{ utils.htmlToText(content) }}
    </p>

    <div
      class="flex flex-wrap gap-1.5
            overflow-hidden "
    >
      <span 
        v-for="(tag, index) in Tags" 
        :key="index" 
        class="border border-[var(--text)] px-1.5 rounded-lg uppercase text-sm truncate"
        :style="{ backgroundColor: tag.color, color: utils.get_text_color(tag.color) }"
      >
        {{ tag.name }}
      </span>
    </div>

  </div>

</PressAndHold>

  <Note_settings
    :id="id"
    :top="note_settings_top"
    :left="note_settings_left"
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

import db from '@/assets/ts/database/database';
import utils from '@/assets/ts/utils';
import type { Tag } from '@/assets/ts/type';

import PressAndHold from '../PressAndHold.vue';
import Note_settings from './Note_Settings.vue';


const props = defineProps<{
    title: string;
    content: string;
    icon?: string;
    date: string;
    pinned: boolean;
    tags: number[];
    id: number;
    uuid: string;
    function_reload: () => Promise<any>;
    click?: () => void;
}>()

const emit = defineEmits(['pin']);
const router = useRouter();

const note_settings = ref<boolean>(false);
const note_settings_top = ref<number>(0);
const note_settings_left = ref<number>(0);
const showDialog = ref<boolean>(false);
const if_pin_active = ref<boolean>(props.pinned)
const press_and_hold = ref<boolean>(false);

const all_tags = ref<Tag[]>([]);
const Tags = ref<Tag[]>([]);


const open_note = (id: number, pinned: boolean) => {
    if (press_and_hold.value) return;
    if (props.click) return props.click();
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

    document.addEventListener('contextmenu', (e) => {

      e.preventDefault();

      note_settings_left.value = e.clientX;
      note_settings_top.value = e.clientY;

    })
        
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
  transform: scale(1.05);
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

.multiline-8 {
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.multiline-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
