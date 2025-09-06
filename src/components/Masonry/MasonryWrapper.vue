<template>
  <div class="masonry-grid">
    <div class="masonry-sizer"></div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, nextTick } from "vue";
import Masonry from "masonry-layout";

let msnry: Masonry | null = null;

onMounted(async () => {
  await nextTick();

  const grid = document.querySelector<HTMLDivElement>('.masonry-grid');
  if (!grid) return;

  msnry = new Masonry(grid, {
    itemSelector: ".masonry-item",
    columnWidth: ".masonry-sizer",
    percentPosition: true,
    gutter: 16,
    transitionDuration: "0.3s"
  });

  grid.style.height = "100%";
});

onBeforeUnmount(() => {
  if (msnry) {
    msnry = null;
  }
});
</script>

<style>
.masonry-grid {
  position: relative;
  width: 100%;
}

.masonry-sizer,
.masonry-item {
  width: 25%;
  padding-bottom: 16px;
}

@media (max-width: 1024px) {
  .masonry-sizer,
  .masonry-item {
    width: 33.333%;
  }
}

@media (max-width: 768px) {
  .masonry-sizer,
  .masonry-item {
    width: 50%;
  }
}

@media (max-width: 480px) {
  .masonry-sizer,
  .masonry-item {
    width: 100%;
  }
}
</style>
