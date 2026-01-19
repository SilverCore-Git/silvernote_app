<script lang="ts" setup>

import { SignUp } from '@clerk/vue';
import { clerkAppearanceSettings } from '@/assets/ts/theme';

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
                    :appearance="clerkAppearanceSettings"
                    routing="path" 
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