<template>
  <div
    class="dragable-wrapper"
    :style="{ top: y + 'px', left: x + 'px' }"
    ref="wrapper"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps<{
    initx?: number;
    inity?: number;
}>()

const x = ref(props.initx || 200); // Position horizontale initiale
const y = ref(props.inity || 100); // Position verticale initiale

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const wrapper = ref<HTMLElement | null>(null);

const startDrag = (event: MouseEvent) => {
  isDragging = true;
  offsetX = event.clientX - x.value;
  offsetY = event.clientY - y.value;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (event: MouseEvent) => {
  if (!isDragging) return;
  x.value = event.clientX - offsetX;
  y.value = event.clientY - offsetY;
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

onMounted(() => {
  if (wrapper.value) {
    // trouver la "poignée" draggable
    const handle = wrapper.value.querySelector('.draggable');
    if (handle instanceof HTMLElement) {
      handle.addEventListener('mousedown', startDrag);
    }
  }
});

onBeforeUnmount(() => {
  if (wrapper.value) {
    const handle = wrapper.value.querySelector('.draggable');
    if (handle instanceof HTMLElement) {
      handle.removeEventListener('mousedown', startDrag);
    }
  }
});


</script>

<style scoped>
.dragable-wrapper {
  position: absolute;
  user-select: none;
}
</style>
