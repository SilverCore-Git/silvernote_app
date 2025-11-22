<template>
  <div 
    ref="pressEl" 
    v-bind="$attrs"
    @contextmenu.prevent="emitLongPress"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount } from "vue";
import Hammer from "hammerjs";

const emit = defineEmits<{
  (e: "long-press"): void;
}>();

const pressEl = ref<HTMLElement | null>(null);
let hammer: HammerManager | null = null;

let emiting: boolean;
function emitLongPress() {
  if (emiting) return;
  emiting = true;
  emit("long-press");
  setTimeout(() => {
    emiting = false;
  }, 500);
}

onMounted(() => {
  if (!pressEl.value) return;

  hammer = new Hammer(pressEl.value);

  hammer.get("press").set({ time: 500 });

  hammer.on("press", emitLongPress);
});

onBeforeUnmount(() => {
  if (hammer) {
    hammer.destroy();
    hammer = null;
  }
});

</script>
