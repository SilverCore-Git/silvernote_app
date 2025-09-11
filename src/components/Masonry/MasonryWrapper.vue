<template>
  <div class="masonry-grid">
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

  grid.style.height = "100%";

  msnry = new Masonry(grid, {
    itemSelector: ".masonry-item",
    columnWidth: ".masonry-item-style",
    percentPosition: true,
    gutter: 16,
    transitionDuration: "0.2s"
  });

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

.masonry-item-style {
  width: 25%;
  margin-bottom: 16px;
}

.masonry-hr-style {
  margin-bottom: 16px;
}


@media (max-width: 1080px) {
  .masonry-sizer,
  .masonry-item-style {
    width: 33.333%; /* 3 colonnes */
  }
}

@media (max-width: 700px) {
  .masonry-sizer,
  .masonry-item-style {
    width: 50%; /* 2 colonnes */
  }
}

</style>
