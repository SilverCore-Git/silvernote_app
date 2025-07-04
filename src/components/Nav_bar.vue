<template>
    
    <div class="bg-[var(--bg2)] shadow-sm py-4 px-6 md:px-12 flex justify-between items-center rounded-b-xl">

        <img class="w-13 cursor-pointer" src="/favicon.svg" @click="router.push('/')" alt="logo">

        <ul class="hidden md:flex items-center space-x-6">
            <li @click="router.push('/')"><a>Maison</a></li>
            <li @click="scroll_to('function')"><a>Fonctionalités</a></li>
            <li @click="scroll_to('price_plan')"><a>Tarifs et abonements</a></li>
            <li @click="router.push('/download')"><a>Télécharger</a></li>
        </ul>

        <Sing_in_btn /> 

        <div class="md:hidden">

            <button @click="toggle_burger_menu" class="text-gray-600 hover:text-gray-900 focus:outline-none">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            
        </div>

    </div>

    <div id="burger-menu" class="hidden md:hidden bg-white shadow-lg  py-4 rounded-b-xl mx-4">

        <ul class="flex items-center justify-center space-x-6">
            <li @click="scroll_to('home')"><a>Maison</a></li>
            <li @click="scroll_to('function')"><a>Fonctionalités</a></li>
            <li @click="scroll_to('price_plan')"><a>Tarifs et abonements</a></li>
        </ul>

    </div>

</template>

<script lang="ts" setup>

import Sing_in_btn from './Sing_in_btn.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const toggle_burger_menu = () => {
    const mobileMenu = document.getElementById('burger-menu');
    mobileMenu?.classList.toggle('hidden');
}

const scroll_to = (id: 'function' | 'home' | 'price_plan') => {
    const element = document.getElementById(id)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
}

</script>