<template>

  <header>

    <SignedOut>

      <SignInButton>

        <button class="second mr-4">
            Se connecter
        </button>
        
      </SignInButton>

    </SignedOut>

    <SignedIn class="flex justify-center items-center">

      <UserButton />
      <span class="ml-2">{{ user?.firstName }} {{ user?.lastName }}</span>

    </SignedIn>

  </header>

</template>

<script setup lang="ts">

    import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/vue'
    const { user } = useUser()

</script>