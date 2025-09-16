<template>
    
    <nav class="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 z-50">

        <div class="flex items-center justify-center flex-row gap-2">
            <img class="hidden md:block w-13 cursor-pointer" src="/favicon.svg" @click="router.push('/')" alt="logo">
            <div class=" uppercase font-bold rounded-sm px-3 py-1.5 border-2 border-[var(--btn)]">beta</div>
        </div>

        <ul class="hidden md:flex items-center space-x-6">
            <li @click="router.push('/')"><a>Maison</a></li>
            <li @click="router.push('/'); scroll_to('function')"><a>Fonctionalités</a></li>
            <li @click="router.push('/'); scroll_to('jeremy')"><a>SilverAI</a></li>
            <li @click="router.push('/'); scroll_to('price_plan')" v-if="we_can_buy"><a>Tarifs et abonements</a></li>
            <li @click="router.push('/download')" v-if="we_can_download"><a>Télécharger</a></li>
        </ul>

        <Sing_in_btn />

        <button 
          @click="menu = !menu" 
          class="cursor-pointer  xl:hidden text-gray-600 hover:text-[var(--primary )] focus:outline-none z-50"
          style="transition: all 0.3s;"
          :class="menu ? 'rotate-90' : 'rotate-0'"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>

    </nav>

    <nav 
      :class="menu ? 'right-0' : '-right-160'"
      class="flex flex-col justify-center items-center bg-white xl:hiden fixed top-0 gap-9 px-10 h-screen z-40 shadow-sm"
      style="transition: all 0.3s;"
    >

        <ul class="flex flex-col items-center justify-center gap-6">
            <li @click="menu = false; router.push('/')"><a>Maison</a></li>
            <li @click="menu = false; router.push('/'); scroll_to('function')"><a>Fonctionalités</a></li>
            <li @click="menu = false; router.push('/'); scroll_to('price_plan')" v-if="we_can_buy"><a>Tarifs et abonements</a></li>
            <li @click="menu = false; router.push('/download')" v-if="we_can_download"><a>Télécharger</a></li>
        </ul>

    </nav>

</template>

<script lang="ts" setup>

import Sing_in_btn from './Sing_in_btn.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { we_can_buy, we_can_download } from '../assets/config';

const router = useRouter();

const menu = ref<boolean>(false);

const scroll_to = (id: 'function' | 'home' | 'price_plan' | 'jeremy') => {
    const element = document.getElementById(id)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
}

</script>