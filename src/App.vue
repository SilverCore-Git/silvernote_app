<template>

  <div v-if="isElectron">
  
    <div class="mr-[var(--mrl)] ml-[var(--mrl)] relative">
      <router-view />
    </div>
  
    <div v-if="loader" class="absolute inset-0 bg-[var(--bg)] z-50">
      <div class="flex justify-center items-center w-screen h-screen">
        <Loader :icon="false" />
      </div>
    </div>
  
  </div>

  <div v-else>
  
    <SignedIn>
  
      <div class="mr-[var(--mrl)] ml-[var(--mrl)] relative">
        <router-view />
      </div>
  
      <div class="z-50 relative">
        <Chatbot />
      </div>
  
      <div v-if="loader" class="absolute inset-0 bg-[var(--bg)] z-50">
        <div class="flex justify-center items-center w-screen h-screen">
          <Loader :icon="false" />
        </div>
      </div>
  
    </SignedIn>

    <SignedOut>
  
      <div>
  
        <div
          v-if="signin_form || signup_form"
          class="left-arrow absolute left-[var(--mrl)] top-[var(--mrl)]"
          @click="router.push({ query: { form: 'main' } })"
        ></div>

        <div v-if="main_form" class="flex flex-col justify-center items-center w-screen h-screen">

          <img class="w-20 mb-2" src="/favicon.svg" alt="" />
          
          <h1 class="text-3xl font-bold mb-8">silvernote</h1>
          
          <button class="second w-35 mb-2" @click="router.push({ query: { form: 'signin' } })">
            Se connecter
          </button>
          
          <button class="primary w-35" @click="router.push({ query: { form: 'signup' } })">
            S'inscrire
          </button>
        
        </div>
        
        <div v-if="signup_form" class="flex flex-col justify-center items-center w-screen h-screen">
          <SignUp />
        </div>
        
        <div v-if="signin_form" class="flex flex-col justify-center items-center w-screen h-screen">
          <SignIn />
        </div>
    
      </div>
    
    </SignedOut>

  </div>

</template>

<script lang="ts" setup>

import { ref, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Loader from "./components/Loader.vue";
import Chatbot from "./components/chatbot/Chatbot.vue";
import db from "./assets/ts/database";
import back, { Session } from "./assets/ts/backend_link";
import { init_theme } from "./assets/ts/theme";
import { SignedIn, SignedOut, SignIn, SignUp, useUser } from "@clerk/vue";

const isElectron = !!(window as any)?.process?.versions?.electron;
const loader = ref(true);
const session = new Session();
const route = useRoute();
const router = useRouter();

const signin_form = ref(route.query.form === "signin");
const signup_form = ref(route.query.form === "signup");
const main_form = ref(route.query.form === "main");

watch(() => route.query.form, (form) => {
  signin_form.value = form === "signin";
  signup_form.value = form === "signup";
  main_form.value = form === "main";
});

const wasOnline = localStorage.getItem("online") === "true";
localStorage.setItem("online", String(navigator.onLine));

const init_db = async () => {
  if (wasOnline) {
    const data = await back.get_all();
    if (data) {
      await db.reset();
      await db.add_notes(data.notes);
      await db.add_tags(data.tags);
    }
  }
};
init_db();

const { user, isLoaded } = useUser();

onMounted(async () => {
  
  init_theme();
  if (!route.query.form) router.push({ query: { form: "main" } });
  let tries = 0;
  const interval = setInterval(async () => {

    if (isLoaded.value && user.value) {

      if (tries >= 5) {
        clearInterval(interval);
        return;
      }

      tries++;
      await session.create(user.value.id);
      clearInterval(interval);

    }

  }, 1000);

  const stopLoader = setInterval(() => {

    if (isLoaded.value) {
      loader.value = false;
      clearInterval(stopLoader);
    }

  }, 500);

});

const screen_w = ref(window.innerWidth);
const body = document.body;

const updateSize = () => {
  screen_w.value = window.innerWidth;
};

window.addEventListener("resize", updateSize);

onUnmounted(() => {
  window.removeEventListener("resize", updateSize);
});

const updateBodyClass = () => {
  body.classList.remove("lgdesktop", "xldesktop");
  if (screen_w.value >= 2000) body.classList.add("xldesktop");
  else if (screen_w.value >= 1500) body.classList.add("lgdesktop");
};

watch(screen_w, updateBodyClass);
onMounted(updateBodyClass);

</script>
