<script lang="ts" setup>

import isMobile from '@/assets/ts/utils/isMobile';
import DesktopAppTitleBar from '@/components/DesktopAppTitleBar.vue';
import { SignIn } from '@clerk/vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const url = new URL('/sauth/redirect', 'http://dummy.local');

url.searchParams.set(
  'redirectUrl',
  String(route.query.redirectUrl ?? '')
);

const redirectUrl = url.pathname + url.search;

</script>

<template>

<div
    class="
        overflow-y-auto fixed
        inset-0 flex flex-col
        h-full w-full
    "
>

    <DesktopAppTitleBar />

    <div class="w-full h-full bg-signin flex justify-center items-center">

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

                <SignIn
                    routing="path" 
                    :oauthFlow="isMobile ? 'redirect' : 'popup'"
                    :forceRedirectUrl="redirectUrl"
                    path="/sauth/sign-in"
                    sign-up-url="/sauth/sign-up"
                />

            </div>

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
