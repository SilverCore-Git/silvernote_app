<script setup lang="ts">
import BackBtn from '@/components/backBtn.vue';
import NavBar from './components/layout/Navbar.vue';

</script>

<template>

  <div
    class="flex flex-raw h-screen max-w-6xl mx-auto"
  >

    <NavBar />

    <div
      class="absolute top-10 left-10"
    >
      <BackBtn />
    </div>

    <div>

    </div>

  </div>

</template>