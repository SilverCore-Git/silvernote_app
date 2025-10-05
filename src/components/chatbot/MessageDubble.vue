<template>

    <div 
        v-if="origin == 'user'" 
        class="bg-[var(--btn)] w-full py-2.5 pl-3 pr-2 rounded-t-2xl rounded-l-2xl"
    >
        <span class="whitespace-pre-wrap break-words text-white">{{ text }}</span>
    </div>

    <div v-if="origin == 'ai'"  class="flex justify-center items-center gap-2">


    <div 
      v-if="text.length < 1"
      class="relative w-12 h-12 flex items-center justify-center"
    >
      
      <div 
        class="absolute w-12 h-12 border-4 border-gray-300 
        border-t-[var(--btn)] rounded-full animate-spin"
      ></div>

      <img
        src="../../assets/img/silverai.png"
        class="w-8 h-8 object-cover rounded-full"
      />
      
    </div>


        <div
            class="border-1 border-[var(--btn)] w-full py-2.5 pl-3 pr-2 rounded-t-2xl rounded-r-2xl"
            :class="text.length < 1 ? 'opacity-0' : 'opacity-100'"
        >
            
            <span 
                class="prose prose-sm max-w-none text-[var(--text)]"
                v-html="marked(text)"
            >
            </span>
        </div>

    </div>

    <div 
        v-if="origin == 'error'" 
        class="border-1 border-[var(--btn)] w-full py-2.5 pl-3 pr-2 rounded-t-2xl rounded-r-2xl"
    >
        <span class=" whitespace-pre-wrap break-words text-red-600">{{ text }}</span>
    </div>

</template>

<script lang="ts" setup>

import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

defineProps<{
    origin: "ai" | 'user' | 'error';
    text: string;
}>()


</script>

<style scoped>

.float {
  animation: float 3s ease-in-out infinite;
}


</style>