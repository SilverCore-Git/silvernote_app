<script setup lang="ts">
  
import Loader from '@/components/Loader.vue';
import { SignOutButton, UserProfile, useUser } from '@clerk/vue';

</script>

<template>

  <div 
    class="
      min-h-screen w-full p-4 lg:p-8
      transition-colors duration-300
      space-y-8
    "
  >
        
    <header>
    
      <h1 class="font-bold text-3xl">
          Paramètres du compte
      </h1>

    </header>
    
    <UserProfile :fallback="Loader" />

    <SignOutButton>
      <button class="primary danger w-full">
        Se déconnecter
      </button>
    </SignOutButton>

    <p class=" text-(--text-little)">
      User id : {{ useUser().user.value?.id }}
    </p>

  </div>

</template>