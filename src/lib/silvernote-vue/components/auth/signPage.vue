<script lang="ts" setup>

import { onMounted, ref, watch } from 'vue';

import SignIn from './SignIn.vue';
import SignUp from './SignUp.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@clerk/vue';

const route = useRoute();
const router = useRouter();
const { isSignedIn, isLoaded } = useAuth();
const form = ref<'signin' | 'signup'>('signin');

onMounted(() => {
  const interval = setInterval(() => {
    if (isLoaded.value) {
      if (isSignedIn.value) 
      {
        if (route.query.redirectUrl)
        {
          const redirectUrl = route.query.redirectUrl as string;

          if (!redirectUrl) {
            router.push('/');
            return;
          }

          const url = new URL(redirectUrl, window.location.origin);
          url.searchParams.set('utm_source', 'silvernote-auth');
          window.location.href = url.toString();
        }
        else
        {
          router.push('/');
        }
      }
      clearInterval(interval)
    }
  }, 200);
})

watch(() => route.query.form, () => {
  if (route.query.form == 'signin' || route.query.form == 'signup')
  {
    form.value = route.query.form as 'signin' | 'signup';
  }
})

</script>

<template>

  <div class="w-screen h-screen bg-signin flex justify-center items-center">

    <div
      class="
            w-full h-full flex justify-start items-center
      "
    >

        <div 
          class="
                w-full lg:w-1/2 justify-center items-center flex-col
          "
          :class="form != 'signup' ? 'flex' : 'hidden'"
        >

            <SignIn />

        </div>

        <div 
          class="
                w-full lg:w-1/2 justify-center items-center flex-col
          "
          :class="form == 'signup' ? 'flex' : 'hidden'"
        >

            <SignUp />

        </div>

    </div>

  </div>

</template>

<style scoped>

.bg-signin {
  background-image: url('../assets/bg/SignIn.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
}
@media (min-width: 1024px) {
  .bg-signin {
    background-image: url('../assets/bg/SignInLg.webp');
  }
}

</style>