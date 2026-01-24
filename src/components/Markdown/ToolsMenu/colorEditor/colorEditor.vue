<template>

  <div 
    :style="{
      top: `${top ? top + 50 : undefined}px`,
      left: `${left ? left + 455 : undefined}px`
    }" 
    class="absolute z-50"
  >

    <transition name="fade-slide">

      <div
        v-if="show"
        class="
          w-52 bg-(--white) 
          border border-(--btn)
          rounded-lg p-3
        "
      >

        <span
          class="
            text-xs font-semibold
            text-(--text-little)
            uppercase tracking-wide
            mb-2 block
          "
        >
          Couleur du texte
        </span>

        <div class="grid grid-cols-6 gap-2 mb-4">

          <div

            v-for="e in colors"

            :key="'text-' + e.color"
            @click="applyColor(e.color === 'default' ? 'default' : e.color, 'text')"
            v-tooltip.bottom="e.name"

            class="
              w-6 h-6 rounded-md cursor-pointer
              flex justify-center items-center
              transition-all duration-200
            "

            :class="[
              isActiveColor(e.color, 'text') 
                ? 'ring-2 ring-(--btn) ring-offset-2 ring-offset-(--bg2) scale-110 font-bold' 
                : 'border border-gray-300 hover:scale-110'
            ]"

            :style="{ 
              color: e.color === 'default' ? 'var(--text)' : e.color,
              borderColor: e.color === 'default' ? '' : darken(e.color)
            }"

          >

            <span class="text-sm">A</span>

          </div>

        </div>

        <hr class="border-gray-200 my-3 opacity-50" />

        <span
          class="
            text-xs font-semibold
            text-(--text-little)
            uppercase tracking-wide
            mb-2 block
          "
        >
          Surlignage
        </span>

        <div class="grid grid-cols-6 gap-2">

          <div

            v-for="e in colors"
            :key="'bg-' + e.color"
            @click="applyColor(e.color === 'default' ? 'default' : e.color, 'bg')"
            v-tooltip.bottom="e.name"

            class="
              w-6 h-6 rounded-md cursor-pointer
              flex justify-center items-center
              transition-all duration-200
            "

            :class="[
              isActiveColor(e.color, 'bg') 
                ? 'ring-2 ring-(--btn) ring-offset-2 ring-offset-(--bg2)' 
                : 'border hover:border-gray-400'
            ]"

            :style="{ 
              backgroundColor: e.color === 'default' ? 'transparent' : e.color,
              borderColor: e.color === 'default' ? 'var(--text-little)' : darken(e.color),
              position: 'relative'
            }"

          >

            <i 
              v-if="isActiveColor(e.color, 'bg') && e.color !== 'default'" 
              class="bi bi-check text-white drop-shadow-md text-lg"
            ></i>

            <div 
              v-if="e.color === 'default'" 
              class="w-full h-px bg-red-400 absolute rotate-45"
            ></div>

          </div>

        </div>

      </div>

    </transition>

  </div>

</template>

<script lang="ts" setup>

import { ref, onMounted, onUnmounted, watch } from 'vue';
import { editor } from '../../Editor';


const colors = [
  { color: 'default', name: 'Par défaut' },
  { color: '#000000', name: 'Noir' },
  { color: '#555555', name: 'Gris' },
  { color: '#FF0000', name: 'Rouge' },
  { color: '#F39C12', name: 'Orange' },
  { color: '#F1C40F', name: 'Jaune' },
  { color: '#2ECC71', name: 'Vert' },
  { color: '#2980B9', name: 'Bleu' },
  { color: '#9B59B6', name: 'Violet' },
  { color: '#FF69B4', name: 'Rose' },
  { color: '#1ABC9C', name: 'Turquoise' },
  { color: '#FFFFFF', name: 'Blanc' },
];

const props = defineProps<{
  top?: number;
  left?: number;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();


const currentTextColor = ref<string>('default');
const currentHighlightColor = ref<string>('default');

  

const updateActiveColors = () => {

  if (!editor.value) return;

  const textStyle = editor.value.getAttributes('textStyle');
  currentTextColor.value = textStyle.color || 'default';

  const highlight = editor.value.getAttributes('highlight');
  currentHighlightColor.value = highlight.color || 'default';

};


const isActiveColor = (color: string, type: 'text' | 'bg') => {

  if (type === 'text')
  {
    if (color === 'default' && !currentTextColor.value) return true;
    return currentTextColor.value === color;
  }
  else
  {
    if (color === 'default' && !currentHighlightColor.value) return true;
    return currentHighlightColor.value === color;
  }

};



const applyColor = (color: string, type: 'text' | 'bg') => {

  if (!editor.value) return;

  editor.value.chain().focus();

  if (type === 'text')
  {
    if (color === 'default') {
      editor.value.chain().unsetColor().run();
    } else {
      editor.value.chain().setColor(color).run();
    }
  }
  else
  {
    if (color === 'default') {
      editor.value.chain().unsetHighlight().run();
    } else {
      editor.value.chain().setHighlight({ color }).run();
    }
  }

  updateActiveColors();
  
  emit('update:show', false);

};



const darken = (hex: string, amount = 40) => {
  
  if (!hex || !hex.startsWith('#')) return 'rgba(0,0,0,0.1)';

  hex = hex.replace('#', '');
  const num = parseInt(hex, 16);

  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0x00FF) - amount;
  let b = (num & 0x0000FF) - amount;

  r = Math.max(r, 0);
  g = Math.max(g, 0);
  b = Math.max(b, 0);

  return `rgb(${r}, ${g}, ${b})`;

};


onMounted(() => {
  if (editor.value) {
    editor.value.on('transaction', updateActiveColors);
    editor.value.on('selectionUpdate', updateActiveColors);
  }
  updateActiveColors();
});

onUnmounted(() => {
  if (editor.value) {
    editor.value.off('transaction', updateActiveColors);
    editor.value.off('selectionUpdate', updateActiveColors);
  }
});

watch(() => props.show, (newVal) => {
  if (newVal) updateActiveColors();
});

</script>