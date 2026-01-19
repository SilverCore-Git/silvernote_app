<template>

  <div 
    :style="{ top: `${top ? top + 50 : undefined}px`, left: `${left ? left + 455 : undefined}px` }" 
    class="absolute"
  >

    <transition name="fade-slide">

      <div
        v-if="show"
        class="w-48 dropdown bg-(--bg2) border border-(--btn)"
      >

        <span class="text-xs text-(--text-little)">
          Couleurs du texte
        </span>

        <div
          class="grid grid-cols-4 gap-2 mx-1 my-2"
        >

          <div

            v-for="e in colors"
            @click="applyColor(e.color == 'default' ? 'default' : e.color, 'text')"
            v-tooltip.bottom="e.name"

            class="
              w-6 h-6 border rounded-sm cursor-pointer
              flex justify-center items-center
            "
            :style="{ 
              color: e.color == 'default' ? 'var(--text)' : e.color, 
              borderColor: darken(e.color == 'default' ? 'var(--text)' : e.color)
            }"

          >
            <strong>A</strong>
          </div>

        </div>

        <hr />

        <span class="text-xs text-(--text-little)">
          Couleur d'arrière plan
        </span>

        <div
          class="grid grid-cols-4 gap-2 mx-1 my-2"
        >

          <div

            v-for="e in colors"
            @click="applyColor(e.color == 'default' ? 'default' : e.color, 'bg')"
            v-tooltip.bottom="e.name"

            class="
              w-6 h-6 border rounded-sm cursor-pointer
              flex justify-center items-center hover:border-2
            "
            :style="{ 
              backgroundColor: e.color == 'default' ? '' : e.color, 
              borderColor: darken(e.color == 'default' ? '' : e.color)
            }"

          ></div>

        </div>

      </div>

    </transition>
    
  </div>

</template>

<script lang="ts" setup>

import { editor } from '../../Editor';

const colors: { color: string, name: string }[] = [
  { color: 'default', name: 'Par défaut' },
  { color: '#FF0000', name: 'Rouge' },
  { color: '#F39C12', name: 'Orange' },
  { color: '#F1C40F', name: 'Jaune' },
  { color: '#2ECC71', name: 'Vert' },
  { color: '#4FC3F7', name: 'Bleu' },
  { color: '#2980B9', name: 'Bleu foncé' },
  { color: '#9B59B6', name: 'Violet' },
  { color: '#FF69B4', name: 'Rose' },
  { color: '#1ABC9C', name: 'Turquoise' },
  { color: '#95A5A6', name: 'Gris' },
  { color: '#7F8C8D', name: 'Gris foncé' },
];



defineProps<{
  top?: number;
  left?: number;
  show: boolean;
}>();

defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();


const applyColor = (color: string, type: 'text' | 'bg') => {
  if (type === 'text')
  {
    if (color === 'default')
    {
      editor.value?.chain().focus().unsetColor().run();
    }
    else
    {
      editor.value?.chain().focus().setColor(color).run();
    }
  }
  else
  {
    if (color === 'default')
    {
      editor.value?.chain().focus().unsetHighlight().run();
    }
    else
    {
      editor.value?.chain().focus().toggleHighlight({ color: color }).run();
    }
  }

}

const darken = (hex: string, amount = 60) => {
  hex = hex.replace('#', '');
  const num = parseInt(hex, 16);

  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0x00FF) - amount;
  let b = (num & 0x0000FF) - amount;

  r = Math.max(r, 0);
  g = Math.max(g, 0);
  b = Math.max(b, 0);

  return `rgb(${r}, ${g}, ${b})`;
}


</script>
