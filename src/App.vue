<template>

  <router-view v-if="isLoaded"  />

  <div v-else class="flex justify-center items-center h-screen overflow-hidden">
    <Loader :icon="false" />
  </div>

</template>


<script lang="ts" setup>

import { useUser } from '@clerk/vue';
import Loader from './components/Loader.vue';
import { watch } from 'vue';

const { isLoaded, user } = useUser();

watch(isLoaded, async () => {

  if (!isLoaded) return;

  const verify = await fetch('https://api.silvernote.fr/user/verify', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user.value?.id })
  }).then(res => res.json());

  if (await verify) return;

  await fetch('https://api.silvernote.fr/user/create', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: user.value })
  })


})


</script>