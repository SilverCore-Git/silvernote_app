<template>
  <div
    v-bind="$attrs"
    @contextmenu.prevent="onLongPress"
    @touchstart="startPress"
    @touchend="cancelPress"
    @touchcancel="cancelPress"
    @mousedown="startPress"
    @mouseup="cancelPress"
    @mouseleave="cancelPress"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'long-press'): void
}>()

const pressTimer = ref<number | null>(null)
const delay = 500

function onLongPress() {
  emit('long-press')
}

function startPress() {
  cancelPress()
  pressTimer.value = window.setTimeout(() => {
    onLongPress()
  }, delay)
}

function cancelPress() {
  if (pressTimer.value !== null) {
    clearTimeout(pressTimer.value)
    pressTimer.value = null
  }
}
</script>
