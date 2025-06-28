<template>

  <div class="mr-[var(--mrl)] ml-[var(--mrl)] relative">
    <router-view></router-view>
  </div>

  <div class=" absolute inset-0 bg-[var(--bg)] z-50" v-if="loader">
      <div class="flex justify-center items-center w-screen h-screen">
          <Loader />
      </div>
  </div>

</template>

<script lang="ts" setup>

  import { init_theme } from './assets/ts/theme';
  init_theme();

  import { ref, onMounted, nextTick, watch } from 'vue';

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
        const data = await back.get_all();
        if (data) {
          await db.reset()
          await db.add_notes(data.notes);
          await db.add_tags(data.tags);
        }
    }
  }
  init_db();

  onMounted(async () => {
  
    await nextTick()

    setTimeout(() => {
      loader.value = false;
    }, wasOnline ? 1000 : 0)

  })

  const screen_w = ref(window.innerWidth);

  const updateSize = () => {
      screen_w.value = window.innerWidth;
  }

  onMounted(() => {
      window.addEventListener('resize', updateSize);
  })

  const body = document.body

  watch(screen_w, () => {

    if (screen_w.value >= 1500) {
      body.classList.add('lgdesktop');
      body.classList.remove('xldesktop');
    } 
    
    if (screen_w.value >= 2000) {
      body.classList.add('xldesktop');
      body.classList.remove('lgdesktop');
    }
    
    if (screen_w.value < 1200) {
      body.classList.remove('lgdesktop');
      body.classList.remove('xldesktop');
    }
  })

    if (screen_w.value >= 1500) {
      body.classList.add('lgdesktop');
      body.classList.remove('xldesktop');
    } 
    
    if (screen_w.value >= 2000) {
      body.classList.add('xldesktop');
      body.classList.remove('lgdesktop');
    }
    
    if (screen_w.value < 1200) {
      body.classList.remove('lgdesktop');
      body.classList.remove('xldesktop');
    }

</script>