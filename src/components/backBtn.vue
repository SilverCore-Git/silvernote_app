<template>
  <div 
    class="left-arrow absolute left-0 cursor-pointer" 
    @click="goBack"
  ></div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  // Si l'historique est plus long que 1, on peut reculer
  if (window.history.length > 1) {
    router.back();
  } else {
    // Sinon on redirige vers la route par défaut de l'app
    router.push({ name: 'Home' }); // Remplace 'Home' par ta route par défaut
  }
};
</script>
