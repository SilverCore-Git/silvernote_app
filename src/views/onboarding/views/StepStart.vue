<template>

  <div class="flex flex-col h-full justify-center">

    <h2 
      class="text-3xl font-bold mb-4 animate-fade-in-up"
      style="animation-delay: 100ms;"
    >
      Bienvenue, {{ name }}.
    </h2>

    <p 
      class="text-lg opacity-70 mb-8 animate-fade-in-up"
      style="animation-delay: 150ms;"
    >
      Silvernote est une extension de votre mémoire.
    </p>

    <button 
      @click="$emit('next')" 
      class="premium w-fit animate-fade-in-up group gap-2"
      style="animation-delay: 200ms;"
    >
      Commencer 
      <i class="bi bi-arrow-right group-hover:translate-x-2 transition-all" />
    </button>

  </div>

</template>

<script setup lang="ts">
defineProps<{ 
  name?: string 
}>();
</script>