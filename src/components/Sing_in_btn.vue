<template>

  <header>

    <SignedOut>

      <SignInButton>

        <button 
            v-if="login || true" 
            class="second mr-4"
        >
            Se connecter
        </button>
        
      </SignInButton>

      <SignUpButton>

        <button 
            v-if="register || true"
            class="primary"
        >
            S'inscrire
        </button>

      </SignUpButton>

    </SignedOut>

    <SignedIn class="flex items-center">

        <UserButton />

    </SignedIn>

  </header>

</template>

<script setup lang="ts">

    import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/vue'

    defineProps<{
        register?: boolean;
        login?: boolean;
    }>()

</script>