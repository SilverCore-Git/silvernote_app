<template>

  <div class="flex flex-col h-full justify-center relative z-10 p-4 md:p-8">

    <h2 
      class="text-4xl md:text-5xl font-bold mb-6 tracking-tight animate-fade-in-up leading-tight"
      style="animation-delay: 100ms;"
    >
      Bienvenue,
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-(--btn) to-(--btn-hover)">
        {{ name || 'Voyageur' }}
      </span>.
    </h2>

    <p 
      class="text-lg opacity-60 mb-8 max-w-md leading-relaxed animate-fade-in-up"
      style="animation-delay: 200ms;"
    >
      Silvernote n'est pas juste une prise de notes.<br>
      C'est une extension <span class="text-(--text) font-medium">intelligente</span> de votre mémoire.
    </p>

    <div 
      class="flex flex-wrap gap-3 mb-10 opacity-80 animate-fade-in-up"
      style="animation-delay: 300ms;"
    >
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-(--text)/5 border border-(--text)/5 flex items-center gap-2">
        <i class="bi bi-pencil-square text-indigo-500"></i> Note
      </span>
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-(--text)/5 border border-(--text)/5 flex items-center gap-2">
        <i class="bi bi-magic text-purple-500"></i> Simple
      </span>
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-(--text)/5 border border-(--text)/5 flex items-center gap-2">
        <i class="bi bi-check-circle-fill text-blue-500"></i> Complète
      </span>
    </div>

    <div class="animate-fade-in-up" style="animation-delay: 400ms;">

      <div class="relative group max-w-75">

          <div class="absolute -inset-1 bg-gradient-to-r from-(--btn) to-(--btn-hover) rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
          <button 
              @click="$emit('next')" 
              class="group premium relative px-10! py-4! font-bold! w-full "
          >
            <div class="relative flex items-center gap-3">
              <span>Commencer l'aventure</span>
              <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

      </div>
      
      <p class="mt-4 text-xs opacity-40 pl-1 hidden md:block">
        Appuyez sur <kbd class="font-sans border border-(--text)/20 rounded px-1 py-0.5 mx-1">Entrée</kbd> pour continuer
      </p>

    </div>

  </div>

</template>

<script setup lang="ts">

import { onMounted, onUnmounted } from 'vue';

const props = defineProps<{ 
  name?: string | null;
}>();

const emit = defineEmits(['next']);

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') emit('next');
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));

</script>