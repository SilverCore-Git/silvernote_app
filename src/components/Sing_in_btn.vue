<template>

  <header>

    <SignedOut>

      <SignInButton>

        <div>

            <button 
                v-if="login || true" 
                class="second mr-4"
            >
                Se connecter
            </button>

            <button 
                v-if="register || true"
                class="primary"
            >
                S'inscrire
            </button>

        </div>
        
      </SignInButton>

    </SignedOut>

    <SignedIn class="flex items-center">

        <UserButton />

    </SignedIn>

  </header>

</template>

<script setup lang="ts">

    import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/vue'

    defineProps<{
        register?: boolean;
        login?: boolean;
    }>()

</script>