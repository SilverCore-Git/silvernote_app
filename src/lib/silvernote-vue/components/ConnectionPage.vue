<script lang="ts" setup>

import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SignInButton, SignUp } from '@clerk/vue';

// import SignIn from './SignIn.vue';
// import SignUp from './SignUp.vue';

const route = useRoute();
const changeForm = ref<number>(route.query.form == 'signup' ? 1 : 0);

watch(() => route.query.form, () => {
  changeForm.value++
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
          :class="route.query.form != 'signup' ? 'flex' : 'hidden'"
        >

            <!-- <SignIn
              oauthFlow="popup"
              :withSignUp="true"
            /> -->

            <SignInButton>
              <button class="primary">Se connecter</button>
            </SignInButton>

        </div>

        <div 
          class="
                w-full lg:w-1/2 justify-center items-center flex-col
          "
          :class="route.query.form == 'signup' ? 'flex' : 'hidden'"
        >

            <SignUp
              oauthFlow="popup"
              :withSignUp="true"
            />

        </div>

    </div>

  </div>

</template>

<style scoped>

.bg-signin {
  background-image: url('./assets/bg/SignIn.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
}
@media (min-width: 1024px) {
  .bg-signin {
    background-image: url('./assets/bg/SignInLg.webp');
  }
}

</style>