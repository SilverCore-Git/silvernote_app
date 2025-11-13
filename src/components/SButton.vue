<template>
  <a
    :href="href"
    class="relative inline-flex items-center justify-center rounded-lg shadow-md px-[16px] h-[37px]"
    :style="buttonStyle"
  >
  
    <span class="text-white text-center font-outfit text-[14px]">
      {{ content }}
    </span>

    <span class="ml-2 inline-flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-[20px] h-[20px]"
      >
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </span>
  </a>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  content: { type: String, default: "Nos services" },
  href: { type: String, default: "#services" },
  bgColor: { type: String, default: "rgb(81, 47, 235)" },
  borderColor: { type: String, default: "rgba(255, 255, 255, 0.1)" },
});

const buttonStyle = computed(() => ({
  backgroundColor: props.bgColor,
  borderStyle: "solid",
  borderWidth: "1px",
  borderColor: props.borderColor,
  boxShadow:
    "rgba(0, 0, 0, 0.15) 0px 0.7px 0.7px -0.625px, rgba(0, 0, 0, 0.14) 0px 1.8px 1.8px -1.25px, rgba(0, 0, 0, 0.14) 0px 3.6px 3.6px -1.875px, rgba(0, 0, 0, 0.13) 0px 6.86px 6.86px -2.5px, rgba(0, 0, 0, 0.1) 0px 13.64px 13.64px -3.125px, rgba(0, 0, 0, 0.05) 0px 30px 30px -3.75px",
}));
</script>

<style>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>

