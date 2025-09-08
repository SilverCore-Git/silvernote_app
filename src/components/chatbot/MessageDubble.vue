<template>

    <div 
        v-if="origin == 'user'" 
        class="bg-[var(--btn)] w-full py-2.5 pl-3 pr-2 rounded-t-2xl rounded-l-2xl"
    >
        <span class="whitespace-pre-wrap break-words text-white">{{ text }}</span>
    </div>

    <div v-if="origin == 'ai'"  class="flex justify-center items-center gap-2">

        <img 
            v-if="text.length < 1"
            src="../../assets/img/jeremy.png" 
            class="w-10 h-10 float"
        />

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

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
}

.float {
  animation: float 3s ease-in-out infinite;
}


</style>