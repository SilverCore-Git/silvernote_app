<template>

  <div 
    :style="{ top: `${top + 50}px`, left: `${left + 455}px` }" 
    class="absolute"
  >

    <transition name="fade-slide">

      <div
        v-if="show"
        class="w-48 dropdown bg-[var(--bg2)] border border-[var(--btn)]"
      >

        <span class="text-xs text-[var(--text-little)]">
          Transformer en
        </span>

        <input 
          v-model="search"
          ref="searchInput"
          placeholder="Rechercher..."
          type="search"
          class="default-input-border-p-0 text-base w-full pl-1"
        />

        <hr />

        <ul class="overflow-auto max-h-60">

          <li
            v-for="o in filteredOpt"
            :key="o.name"
            @click="exec(o.fn)"
            class="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded"
          >
            {{ o.name }}
          </li>

          <li 
            v-if="filteredOpt.length < 1"
            class="text-sm"
          >
            Aucune option trouvée
          </li>

        </ul>

      </div>

    </transition>
    
  </div>

</template>

<script lang="ts" setup>

import { defineProps, defineEmits, ref, computed, watch, nextTick } from 'vue';
import config from './mdInputMenu.json';
import { editor } from '../../Editor';
import type { Editor } from '@tiptap/core';

const props = defineProps<{
  top: number;
  left: number;
  show: boolean;
  type?: 'insert' | 'all';
}>();

defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();

interface Opt {
  name: string;
  fn: string;
}

const insertName: string[] = [
  'Image',
  'Lien vers une note',
  'Liste à puces',
  'Liste numérotée',
  'Liste de tâches',
  'Code inline',
  'Titre h1',
  'Titre h2',
  'Titre h3',
]

const search = ref<string>('');
const opt = ref<Opt[]>(
  props.type 
    ? props.type == 'insert'
      ? config.filter(c => insertName.includes(c.name))
      : config
    : config);
const searchInput = ref<HTMLInputElement | null>(null)

const filteredOpt = computed(() => {
  if (!search.value) return opt.value;
  return opt.value.filter(o =>
    o.name.toLowerCase().includes(search.value.toLowerCase())
  );
});


const exec = (action: string) => {
  if (action.startsWith('getImageFile')) return insertImageFromFile(editor.value as Editor);
  const fn = new Function("editor", `return (${action})()`);
  fn(editor.value);
};

watch(() => props.show, async (val) => {
  if (val) {
    await nextTick()
    searchInput.value?.focus()
  }
})

const insertImageFromFile = (editor: Editor) => {
  
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      editor.chain().focus().setImage({ src: url }).run();
    };
    reader.readAsDataURL(file);
  };

  input.click();
};

</script>
