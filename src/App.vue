<template>

  <SignedIn>

    <div class="mr-[var(--mrl)] ml-[var(--mrl)] relative">
      <router-view></router-view>
    </div>

    <div class=" absolute inset-0 bg-[var(--bg)] z-50" v-if="loader">
        <div class="flex justify-center items-center w-screen h-screen">
            <Loader />
        </div>
    </div>

  </SignedIn>

  <SignedOut>

    <div>

      <div v-if="signin_form || signup_form" class="left-arrow absolute left-[var(--mrl)] top-[var(--mrl)]" @click="router.push('?form=main')"></div>

      <div v-if="main_form" class="flex flex-col justify-center items-center w-screen h-screen">

        <img class="w-20 mb-2" src="/favicon.svg" alt="">

        <h1 class="text-3xl font-bold mb-8">silvernote</h1>

        <a @click="router.push('?form=signin')" class="mb-2">

          <button class="second w-35">
            Se connecter 
          </button>

        </a>

        <a @click="router.push('?form=signup')">

          <button class="primary w-35">
            S'inscrire 
          </button>

        </a>

      </div>

      <!-- for sign up -->
      <div v-if="signup_form" class="flex flex-col justify-center items-center w-screen h-screen">

        <SignUp />

      </div>

      <!-- for sign in -->
      <div v-if="signin_form" class="flex flex-col justify-center items-center w-screen h-screen">

        <SignIn />

      </div>


    </div>

  </SignedOut>

</template>

<script lang="ts" setup>

  import { init_theme } from './assets/ts/theme';
  init_theme();

  import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import Loader from './components/Loader.vue';

  import db from './assets/ts/database';
  import back, { Session  } from './assets/ts/backend_link';
  const session = new Session;

  import { SignedIn, SignedOut, SignIn, SignUp, useUser } from '@clerk/vue';

  const loader = ref<boolean>(true);
  const wasOnline = localStorage.getItem('online') === 'true';
  const isOnline = navigator.onLine;

  const route = useRoute();
  const router = useRouter();

  const signin_form = ref<boolean>(route.query.form == "signin" ? true : false); 
  const signup_form = ref<boolean>(route.query.form == "signup" ? true : false);
  const main_form = ref<boolean>(route.query.form == "main" ? true : false);

  watch(() => route.query.form, () => {
    signin_form.value = route.query.form == "signin" ? true : false;
    signup_form.value = route.query.form == "signup" ? true : false;
    main_form.value = route.query.form == "main" ? true : false;
  })

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
  
    if (!route.query.form) router.push('?form=main')

    const { user, isLoaded } = useUser()

    const interval = setInterval(async () => {
      if (isLoaded.value && user.value) {
        await session.create(user.value.id);
        clearInterval(interval);
      }
    }, 100)

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

  onUnmounted(() => {
      window.removeEventListener('resize', updateSize);
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