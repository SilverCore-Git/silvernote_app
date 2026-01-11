<script setup lang="ts">

import NavBar from './components/layout/Navbar.vue';
import Account from './components/views/Account.vue';
import Appearance from './components/views/Appearance.vue';
import Legal from './components/views/Legal.vue';
import Mydata from './components/views/Mydata.vue';
import Preferences from './components/views/Preferences.vue';

defineProps<{
  page: string;
}>();

</script>

<template>

  <div
    class="flex flex-raw h-screen max-w-6xl mx-auto"
  >

    <NavBar />

    <div
      class="w-full h-full p-10"
    >

      <Legal v-if="page == 'legal'" />
      <Mydata v-else-if="page == 'mydata'" />
      <Appearance v-else-if="page == 'appearance'" />
      <Preferences v-else-if="page == 'preferences'" />
      <Account v-else />

    </div>

  </div>

</template>