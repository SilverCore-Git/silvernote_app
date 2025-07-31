<template>

  <router-view v-if="isLoaded"  />

  <div v-else class="flex justify-center items-center h-screen overflow-hidden">
    <Loader :icon="false" />
  </div>

</template>


<script lang="ts" setup>

import { useUser } from '@clerk/vue';
import Loader from './components/Loader.vue';

const { isLoaded } = useUser();

</script>