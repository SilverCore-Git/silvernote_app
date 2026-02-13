<script setup lang="ts">
  
import Loader from '@/components/Loader.vue';
import { SignOutButton, UserProfile, useUser } from '@clerk/vue';

</script>

<template>

  <div 
    class="
      min-h-full w-full px-4 lg:px-8 py-8
      transition-colors duration-300
      space-y-8 max-w-5xl mx-auto
    "
  >
        
    <header>
    
      <h1 class="font-bold text-3xl">
          Paramètres du compte
      </h1>

    </header>
    
    <UserProfile :fallback="Loader" />

    <SignOutButton>
      <button class="primary danger w-full max-w-[55em]">
        Se déconnecter
      </button>
    </SignOutButton>

    <p class=" text-(--text-little)">
      User id : {{ useUser().user.value?.id }}
    </p>

  </div>

</template>