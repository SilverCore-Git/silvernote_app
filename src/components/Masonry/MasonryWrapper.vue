<template>

    <div class="masonry-grid">
        
        <div class="masonry-sizer"></div>

        <slot></slot>

    </div>

</template>


<script lang="ts" setup>

import { onMounted, onBeforeUnmount } from "vue";
import Masonry from "masonry-layout";

let msnry: null | any = null;

onMounted(() => {

    msnry = new Masonry(".masonry-grid", {
        itemSelector: ".masonry-item",
        columnWidth: ".masonry-sizer",
        percentPosition: true,
        gutter: 16
    });

});

onBeforeUnmount(() => {
    if (msnry) msnry.destroy();
});


</script>


<style>

.masonry-grid {
  display: flex;
  margin-left: -16px;
  width: auto;
}

.masonry-sizer,
.masonry-item {
  width: 25%;
  padding-left: 16px;
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
    width: 100%; /* 1 colonne */
  }
}

</style>
