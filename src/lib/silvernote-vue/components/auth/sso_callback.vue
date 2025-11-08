<script setup lang="ts">
import { AuthenticateWithRedirectCallback } from '@clerk/vue';

</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <AuthenticateWithRedirectCallback />
    <div id="clerk-captcha" />
  </div>
</template>

