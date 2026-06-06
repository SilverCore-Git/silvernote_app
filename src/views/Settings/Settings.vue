<script setup lang="ts">

import BackBtn from '@/components/backBtn.vue';
import MobileNavBar from './components/layout/MobileNavBar.vue';
import NavBar from './components/layout/Navbar.vue';
import AccountSecurity from './components/views/AccountSecurity.vue';
import Appearance from './components/views/Appearance.vue';
import Mydata from './components/views/Mydata.vue';
import HelpLegal from './components/views/HelpLegal.vue';
import DesktopAppTitleBar from '@/components/DesktopAppTitleBar.vue';
import isElectron from '@/assets/ts/utils/isElectron';

defineProps<{
  page: string;
}>();

</script>

<template>

<div
    class="
        overflow-y-hidden fixed
        inset-0 flex flex-col
        h-full w-full
        bg-(--bg2)
    "
>

  <DesktopAppTitleBar />

  <div
    :key="page"
    class="flex flex-raw h-full w-full"
  >

    <NavBar class="lg:block hidden" />
    <MobileNavBar />

    <BackBtn class="absolute top-2 left-1 lg:hidden" />
    <div 
      class="absolute z-45 h-30 pointer-events-none top-0 inset-x-0 lg:hidden"
      style="background: linear-gradient(to top, transparent 0%, var(--bg2) 100%);" 
    />

    <div
      class="w-full h-full xl:px-10 py-10 overflow-y-auto pb-20 bg-(--bg)"
      :class="isElectron ? 'rounded-tl-xl border-t border-l border-(--text-little)/20' : ''"
    >

      <AccountSecurity v-if="page == 'account'" />
      <Mydata v-else-if="page == 'mydata'" />
      <Appearance v-else-if="page == 'appearance'" />
      <HelpLegal v-else-if="page == 'help'" />
      <AccountSecurity v-else />

    </div>

  </div>

</div>

</template>