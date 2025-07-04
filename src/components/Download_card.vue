<template>

  <a
    :href="downloadLink"
    target="_blank"
    rel="noopener noreferrer"
    class="flex flex-col items-center p-6 rounded-xl text-center transition-transform duration-200 hover:scale-105"
    :class="cardClasses"
  >

    <div v-html="svg" class="mb-4"></div>

    <h3 class="text-xl font-semibold mb-2">{{ platformName }}</h3>

    <span class="text-sm font-medium" :class="buttonTextClasses">{{ buttonText }}</span>

  </a>

</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  platform: 'windows' | 'macos' | 'android' | 'ios' | 'web' | 'linux';
  platformName: string;
  downloadLink: string;
  svg?: string;
  buttonText?: string;
}>();


const cardClasses = computed(() => ({
  'bg-[var(--bg2)] text-gray-800 border border-transparent hover:border-[var(--btn)]': true, 
}));


const buttonTextClasses = computed(() => ({
  'text-[var(--btn)]': true,
}));

const buttonText = computed(() => props.buttonText || 'Télécharger');
</script>

