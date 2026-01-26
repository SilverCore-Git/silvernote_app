<script setup lang="ts">

import BackBtn from '@/components/backBtn.vue';
import MobileNavBar from './components/layout/MobileNavBar.vue';
import NavBar from './components/layout/Navbar.vue';
import Account from './components/views/Account.vue';
import Appearance from './components/views/Appearance.vue';
import Legal from './components/views/Legal.vue';
import Mydata from './components/views/Mydata.vue';
import Preferences from './components/views/Preferences.vue';
import Developpeurs from './components/views/developpeurs/Developpeurs.vue';
import DesktopAppTitleBar from '@/components/DesktopAppTitleBar.vue';

defineProps<{
  page: string;
}>();

</script>

<template>

<div
    class="
        overflow-y-auto fixed
        inset-0 flex flex-col
        h-full w-full
    "
>

  <DesktopAppTitleBar />

  <div
    :key="page"
    class="flex flex-raw h-screen w-screen"
  >

    <NavBar class="lg:block hidden" />
    <MobileNavBar />
    <BackBtn class="absolute top-4 left-4 lg:hidden" />

    <div
      class="w-full h-full xl:px-10 py-10 overflow-y-auto pb-20"
    >

      <Legal v-if="page == 'legal'" />
      <Mydata v-else-if="page == 'mydata'" />
      <Appearance v-else-if="page == 'appearance'" />
      <Preferences v-else-if="page == 'preferences'" />
      <Developpeurs v-else-if="page == 'developpeurs'" />
      <Account v-else />

    </div>

  </div>

</div>

</template>