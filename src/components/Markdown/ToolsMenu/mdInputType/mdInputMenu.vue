<template>

  <div 
    :style="{ top: `${top ? top : undefined}px`, left: `${left ? left : undefined}px` }" 
    class="absolute"
  >

    <transition name="fade-slide">

      <div
        v-if="show"
        class="w-48 dropdown bg-(--bg2) border border-(--btn)"
      >

        <span class="text-xs text-(--text-little)">
          Transformer en
        </span>

        <input 
          v-if="searchType !== 'props'"
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
            @click="exec(o.fn); emit('update:show', false)"
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

import { ref, computed, watch, nextTick, onMounted } from 'vue';
import config from './mdInputMenu.json';
import { editor } from '../../Editor';

const props = defineProps<{
  top?: number;
  left?: number;
  show: boolean;
  type?: 'insert' | 'all';
  searchType?: 'props';
  query?: string;
}>();

const emit = defineEmits<{
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
  'Tableau'
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
  if (action.startsWith('getImageFile')) return insertImageFromFile();
  const fn = new Function("editor", `return (${action})()`);
  fn(editor.value);
};

watch(() => props.show, async (val) => {
  if (val) {
    await nextTick()
    searchInput.value?.focus()
  }
})

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (error) => reject(error);
  });
};

const insertImageFromFile = () => {

  // 1. Créer un input de fichier invisible
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*'; // Accepter uniquement les images

  input.onchange = async (event) => {
    
    const target: EventTarget | null = event.target;
    const as = target as HTMLInputElement;

    const file = as.files?.[0];
    console.log(file || 'no file')
    if (file) {
      
      const url = await convertToBase64(file);

      editor.value
        ?.chain()
        .focus()
        .setImage({ src: url, alt: file.name })
        .createParagraphNear()
        .run();
    }
  };

  input.click();
    
  // editor.value.chain().focus().insertContent({
  //   type: 'imageUpload',
  //   attrs: {
  //     accept: 'image/*',
  //     limit: 3,
  //     maxSize: 10 * 1024 * 1024, // 10 MB
  //   },
  // }).run()

};

onMounted(() => {
  if (props.searchType == 'props')
  {
    if (props.query)
    {
      watch(() => props.query, () => {
        search.value = props.query!;
      })
    }
  }
})

</script>
