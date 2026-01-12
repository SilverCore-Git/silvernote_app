<script setup lang="ts">
import { clerkAppearanceSettings } from '@/assets/ts/theme';
import { UserProfile } from '@clerk/vue';

</script>

<template>

  <div class="min-h-screen w-full p-8 transition-colors duration-300">
        
    <header class="mb-8">
    
      <h1 class="font-bold text-3xl mb-4">
          Paramettre du compte
      </h1>

    </header>
    
    <UserProfile 
        :appearance="clerkAppearanceSettings"
    />

  </div>

</template>