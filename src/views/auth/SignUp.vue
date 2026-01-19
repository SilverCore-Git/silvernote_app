<script lang="ts" setup>

import { SignIn } from '@clerk/vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const redirectUrl = route.query.redirectUrl;

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
                    w-full justify-center items-center flex-col flex
                "
            >

                <SignUp
                    routing="path" 
                    oauthFlow="popup"
                    :forceRedirectUrl="redirectUrl"
                    path="/sauth/sign-up" 
                    sign-in-url="/sauth/sign-in"
                />

            </div>

        </div>

    </div>

</template>

<style scoped>

.bg-signin {
  background-image: url('/assets/img/sign-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
}


</style>