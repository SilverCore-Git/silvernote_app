<template>

  <router-view></router-view>

  <div class=" absolute inset-0 bg-[var(--bg)] z-50" v-if="loader">
      <div class="flex justify-center items-center w-screen h-screen">
          <Loader />
      </div>
  </div>

</template>

<script lang="ts" setup>

  import { init_theme } from './assets/ts/theme';
  init_theme();

  import { ref, onMounted, nextTick } from 'vue';

  import Loader from './components/Loader.vue';

  import db from './assets/ts/database';
  import back from './assets/ts/backend_link';

  const loader = ref<boolean>(true);
  const wasOnline = localStorage.getItem('online') === 'true';
  const isOnline = navigator.onLine;

  if (!isOnline && wasOnline) {
    localStorage.setItem('online', 'false');
  } else {
    localStorage.setItem('online', localStorage.getItem('online') || String(isOnline));
  }

  const init_db = async () => {
    if (wasOnline) {
        await db.reset()
        const data = await back.get_all();
        await db.add_notes(data.notes);
        await db.add_tags(data.tags);
    }
  }
  init_db();

  onMounted(async () => {
  
    await nextTick()

    setTimeout(() => {
      loader.value = false;
    }, wasOnline ? 1000 : 0)

  })

</script>