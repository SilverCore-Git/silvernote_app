<script lang="ts" setup>

import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import SignIn from './SignIn.vue';
import SignUp from './SignUp.vue';

const route = useRoute();
const changeForm = ref<number>(0);

watch(() => route.query.form, () => {
  changeForm.value++
})

</script>

<template>

  <div class="w-screen h-screen bg-signin">

    <div
      class="
            flex justify-start items-center
             transition-all duration-500
      "
      :style="{ transform: `rotate(${180*changeForm}deg)` }"
    >

        <div 
          class="
                h-screen w-screen lg:w-1/2 flex justify-center items-center flex-col
                transition-all duration-200
          "
          :class="route.query.form == 'signin' ? 'opacity-100' : 'opacity-0'"
        >

            <SignIn />

        </div>

        <div 
          class="
                h-screen w-screen lg:w-1/2 flex justify-center items-center flex-col
                transition-all duration-200
          "
          :class="route.query.form == 'signup' ? 'opacity-100' : 'opacity-0'"
        >

            <SignUp style="transform: scale(-1);" />

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