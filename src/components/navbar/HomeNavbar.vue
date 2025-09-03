<template>

    <header 
        style="
            font-family: 'InterTight', sans-serif; 
            box-shadow: 0 0 15px #36363681;
            padding-top: calc(env(safe-area-inset-top)/2);
        " 
        class="
                top-0 left-0 w-screen
                text-2xl font-bold
                bg-[var(--btn)] z-50
                flex items-center justify-center fixed 
            "
    >

        <div class="flex flex-row justify-between items-center w-full ml-[var(--mrl)] mr-[var(--mrl)]">
            
            <div class="flex flex-row justify-center items-center">

                <h1 class=" text-white flex flex-row justify-center items-center gap-2 text-[3vw] lg:text-3xl">
                    <img src="/favicon.svg" class="w-[3vw] min-w-8 max-w-8" alt="logo"><span class="hidden sm:block">SilverNote</span>
                </h1>

            </div>

            <div class="flex flex-row justify-center items-center gap-6 md:gap-5">


                <div class="flex items-center justify-center">
                    <UserButton />
                </div>

                <slot></slot>

                <div
                    class="ellipsis-svg
                            w-8
                            h-8
                        " 
                    @click="if_open_dropdown = !if_open_dropdown"
                ></div>

                <transition name="fade-slide">

                    <div
                        v-if="if_open_dropdown"
                        class="dropdown color absolute bg-[var(--btn)] text-white z-50 right-0 md:right-auto"
                        :style="{ top: `calc(3rem + env(safe-area-inset-top))` }"
                    >

                        <ul>

                            <li @click="router.push('/settings')">
                                <div class="gear-svg nav-svg max-w-6 max-h-6 min-w-6 min-h-6"></div>
                                Paramètre
                            </li>

                            <li @click="openAccount">

                                <div class="nav-svg max-w-6 max-h-6 min-w-6 min-h-6" style="filter: invert(0);">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                    </svg>
                                </div>

                                Compte

                                <div class="nav-svg max-w-6 max-h-6 min-w-6 min-h-6 mr-0 ml-2" style="filter: invert(1);">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>

                            </li>

                            <span class="text-base flex justify-center w-full mt-1">version : {{ version }}</span>
                            <span v-if="dev" class="text-base flex justify-center w-full">acces developpeur</span>
                            
                        </ul>

                    </div>

                </transition>


            </div>

        </div>

    </header>

</template>

<script lang="ts" setup>

import { UserButton } from '@clerk/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { version, dev } from '../../../package.json';

const router = useRouter();
const if_open_dropdown = ref<boolean>(false);

const openAccount = () => {
    window.open('https://www.silvernote.fr/user/profile');
}


</script>

<style scoped>

header {
    height: calc(3.5rem + env(safe-area-inset-top));
    @media (min-width: 1280px) {
        height: calc(3.6rem + env(safe-area-inset-top));
    }
}

.ellipsis-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/assets/svgs/ellipsis.svg');
    filter: invert(1);
    transition: all 0.3s ease;
}

.nav-svg {
    filter: invert(1);
    width: 3vw;
    height: 3vw;
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 10px;
}

.gear-svg {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../assets/svgs/gear.svg');
}


</style>