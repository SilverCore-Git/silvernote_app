<template>

  <div>
  
    <SignedIn>

      <div class=" w-full h-full" :class="[ 'Edit', 'Share' ].includes(route.name) ? 'flex' : ''">
        
        <div 
          v-if="!loader && !is_offline"
          class="flex-1 relative overflow-hidden"
          :class="[ 'Edit', 'Share' ].includes(route.name) ? 'mx-4' : 'mr-[var(--mrl)] ml-[var(--mrl)] '"
        >
          <router-view />
        </div>

        <div v-if="true"
            class=" z-50 relative">
          <Chatbot :visible="open_chatbot" />
        </div>

      </div>


      <div v-if="loader" class="fixed inset-0 bg-[var(--bg)] z-50">
        <div class="flex justify-center items-center w-screen h-screen">
          <Loader :icon="false" />
        </div>
      </div>

      <div v-if="is_offline" class="fixed inset-0 bg-[var(--bg)] z-50">
        <div class="flex justify-center items-center flex-col w-screen h-screen">

            <div class="w-30 h-30">
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <g fill="#2e3436">
                    <path d="m 8 1.992188 c -2.617188 0 -5.238281 0.933593 -7.195312 2.808593 l -0.496094 0.480469 c -0.3984378 0.378906 -0.410156 1.011719 -0.03125 1.410156 c 0.382812 0.398438 1.015625 0.410156 1.414062 0.027344 l 0.5 -0.476562 c 3.085938 -2.953126 8.53125 -2.953126 11.617188 0 l 0.5 0.476562 c 0.398437 0.382812 1.03125 0.371094 1.414062 -0.027344 c 0.378906 -0.398437 0.367188 -1.03125 -0.03125 -1.410156 l -0.496094 -0.480469 c -1.957031 -1.875 -4.578124 -2.808593 -7.195312 -2.808593 z m -0.03125 4.007812 c -1.570312 0.011719 -3.128906 0.628906 -4.207031 1.8125 l -0.5 0.550781 c -0.375 0.40625 -0.347657 1.042969 0.0625 1.414063 c 0.410156 0.371094 1.042969 0.339844 1.414062 -0.070313 l 0.5 -0.542969 c 1.242188 -1.363281 3.992188 -1.492187 5.398438 -0.128906 c 0.121093 -0.023437 0.242187 -0.035156 0.363281 -0.035156 c 0.53125 0 1.039062 0.210938 1.414062 0.585938 l 0.222657 0.222656 c 0.011719 -0.011719 0.023437 -0.019532 0.039062 -0.03125 c 0.40625 -0.371094 0.4375 -1.007813 0.0625 -1.414063 l -0.5 -0.550781 c -1.125 -1.230469 -2.703125 -1.824219 -4.269531 -1.8125 z m 0.03125 4 c -0.511719 0 -1.023438 0.195312 -1.414062 0.585938 c -0.78125 0.78125 -0.78125 2.046874 0 2.828124 s 2.046874 0.78125 2.828124 0 c 0.210938 -0.210937 0.359376 -0.453124 0.457032 -0.714843 l -0.285156 -0.285157 c -0.554688 -0.554687 -0.707032 -1.367187 -0.46875 -2.070312 c -0.335938 -0.226562 -0.726563 -0.34375 -1.117188 -0.34375 z m 0 0" fill-opacity="0.34902"/>
                    <path d="m 11 10 c -0.265625 0 -0.519531 0.105469 -0.707031 0.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 l 1.292969 1.292969 l -1.292969 1.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 s 1.023437 0.390625 1.414062 0 l 1.292969 -1.292969 l 1.292969 1.292969 c 0.390625 0.390625 1.023437 0.390625 1.414062 0 s 0.390625 -1.023437 0 -1.414062 l -1.292969 -1.292969 l 1.292969 -1.292969 c 0.390625 -0.390625 0.390625 -1.023437 0 -1.414062 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 s -0.519531 0.105469 -0.707031 0.292969 l -1.292969 1.292969 l -1.292969 -1.292969 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 z m 0 0"/>
                </g>
              </svg>
            </div>

            <div class="my-10 text-center">
              <h2 class=" text-2xl ">Pas de connexion internet</h2>
              <span class="text-sm">Vérifier la connexion réseau et réessayer.</span>
            </div>

            <button class="primary" @click="reload">
              Réessayer
            </button>
          
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
import { Session } from "./assets/ts/backend_link";
import { init_theme } from "./assets/ts/theme";
import { SignedIn, SignedOut, SignIn, SignUp, useUser } from "@clerk/vue";
import { loaded } from "./assets/ts/utils";
import InitDB from "./assets/ts/database/init";

const loader = ref<boolean>(true);
const open_chatbot = ref<boolean | undefined>(undefined);
const session = new Session();
const route = useRoute();
const router = useRouter();
const { user, isLoaded } = useUser();

const signin_form = ref<boolean>(route.query.form === "signin");
const signup_form = ref<boolean>(route.query.form === "signup");
const main_form = ref<boolean>(route.query.form === "main");
const is_offline = ref<boolean>(false);

watch(() => route.query.form, (form) => {
  signin_form.value = form === "signin";
  signup_form.value = form === "signup";
  main_form.value = form === "main";
});

const reload = () => {
  window.location.reload();
}

watch(isLoaded, (loaded) => {
  if (loaded && !user.value?.id) {
    router.push({ query: { ...route.query, form: "main" } });
  }
});

onMounted(async () => {
  
  init_theme();

  let tries = 0;

  const interval = setInterval(async () => {

    if (isLoaded.value && user.value) {

      await session.create(user.value);

      InitDB.init(user);
      await InitDB.main();

      clearInterval(interval);

    }

    if (tries >= 5) {
      is_offline.value = true;
      clearInterval(interval);
      return;
    }

    tries++

  }, 1000);

  const chatbot = route.query?.chatbot || '0';
  open_chatbot.value = chatbot === '1';

  const stopLoader = setInterval(() => {

    if (isLoaded.value && InitDB.isLoaded()) {
      loader.value = false;
      loaded.value = true;
      clearInterval(stopLoader);
    }

  }, 1000);

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
