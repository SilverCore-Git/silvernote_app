<script setup lang="ts">

import { ref } from 'vue';
import { useDraggable } from '@vueuse/core';
import App2048 from './App2048.vue';

defineProps<{
  show: boolean
}>();

const emit = defineEmits(['update:show']);

const el = ref<HTMLElement | null>(null);
const handle = ref<HTMLElement | null>(null);

// Gestion du drag & drop via VueUse
const { style } = useDraggable(el, {
  initialValue: { x: 100, y: 100 },
  handle: handle, // On ne peut le déplacer que par le header
});

const close = () => emit('update:show', false);
</script>

<template>
  <Teleport to="body">
    <transition name="fade-slide">
        <div v-if="show" ref="el" :style="style" class="popup-container shadow-lg border border-(--text)/20">
            <div ref="handle" class="popup-header px-3 py-1.5 bg-(--bg) border-b border-(--text)/20">
                <span class="title">🎮 2048 - Game</span>
                <button class="default" @click="close">✕</button>
            </div>

            <div class="bg-(--bg) p-2">
                <App2048 />
            </div>
        </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.popup-container {
  position: fixed;
  z-index: 1000;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  touch-action: none;
}

.popup-header {
  cursor: grab;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.popup-header:active {
  cursor: grabbing;
}

.title {
  font-weight: bold;
  font-family: sans-serif;
}

</style>