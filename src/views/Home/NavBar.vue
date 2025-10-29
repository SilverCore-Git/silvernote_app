<template>

    <div 
        class="fixed inset-0 z-50"
        @click="if_open_dropdown = false"
        v-if="if_open_dropdown"
    ></div>

    <header 
        style="
            font-family: 'InterTight', sans-serif; 
            box-shadow: 0 0 15px #36363681;
        " 
        class="
                fixed inset-y-0 left-0
                text-2xl font-bold w-[16vw]
                bg-[var(--bg2)] z-50 p-4
                flex items-start justify-center dropdown
            "
    >

        <ul class="w-full">
            
            <li class="gap-2 w-full">

                <img src="/favicon.svg" class="w-8 rounded-md">

                <div class="flex flex-col">
                    <span class="text-base">SilverNote</span>
                    <span class="text-[var(--text-little)] text-[10px] -mt-1">version {{ version }}</span>
                </div>

            </li>

            <div 
                class="flex flex-row justify-between items-center 
                        gap-6 md:gap-5 w-full mb-4 px-2"
            >

                <a class="p-1.5 flex items-center justify-center ">
                    <UserButton 
                        :appearance="{
                            elements: {
                                userButtonAvatarBox: {
                                    width: '24px',
                                    height: '24px'
                                }
                            }
                        }" 
                        />
                </a>

                <slot></slot>

                <a class="p-1.5">
                    <div
                        class="gear-svg
                                w-7
                                h-7
                            "
                        @click="router.push('/settings')"
                    ></div>
                </a>

            </div>

                            <transition name="fade-slide">

                    <div
                        v-if="if_open_dropdown"
                        class="dropdown absolute bg-[var(--btn)] top-14
                            text-white z-50 right-0 2xl:right-auto"
                    >

                        <ul class="min-w-60 w-full">

                            <li @click.stop="router.push('/settings')" class="text-lg">
                                <div class="gear-svg nav-svg max-w-6 max-h-6 min-w-6 min-h-6"></div>
                                Paramètre
                            </li>

                            <li @click.stop="openAccount" class="text-lg">

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

                            <hr />

                            <li @click.stop="toggle_notes_views_mode()" class="text-lg">
                                <div class="nav-svg max-w-6 max-h-6 min-w-6 min-h-6" :class="notes_views_mode == 'default' ? 'grid-svg' : 'grid2-svg'"></div>
                                Organiser par {{ notes_views_mode == "default" ? 'dossiers' : 'épinglé' }} 
                            </li>

                            <hr />

                            <div 
                                class="mt-1 flex flex-col text-center w-full"
                            >

                                <p class="text-base">
                                    version : {{ version }}
                                </p>

                                <p v-if="dev" class="text-base">
                                    acces developpeur
                                </p>

                            </div>

                        </ul>

                    </div>

                </transition>

        </ul>

    </header>

</template>

<script lang="ts" setup>

import { UserButton } from '@clerk/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { version, dev } from '../../../package.json';
import { notes_views_mode, toggle_notes_views_mode } from '@/assets/ts/Notes_views';

const router = useRouter();
const if_open_dropdown = ref<boolean>(false);

const openAccount = () => {
    window.open('https://www.silvernote.fr/user/profile');
}


</script>

<style scoped>

.ellipsis-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/assets/svgs/ellipsis.svg');
    transition: all 0.3s ease;
}

.nav-svg {
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
    filter: brightness(0) saturate(100%) invert(61%) sepia(43%) saturate(1182%) hue-rotate(343deg) brightness(99%) contrast(92%);
}

.grid-svg {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../assets/svgs/grid.svg');
}

.grid2-svg {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../assets/svgs/grid2.svg');
}


</style>