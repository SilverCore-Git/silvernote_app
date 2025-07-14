<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] ">

        <Nav_bar />

    </nav>

    <header 
        id="home"
        class=" bg-cover bg-center rounded-xl my-8 w-[calc(100vw_-_2rem)] mx-4 h-160 mt-26" 
        style="background-image: url('/assets/img/hero_baner.jpg');"
    >

        <div class="w-full h-160 rounded-xl text-center py-20 md:py-32" style="backdrop-filter: blur(8px) contrast(80%) brightness(200%);">

            <div class="mx-auto px-4 max-w-4xl">

                <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
                    Vos notes <span class="text-[var(--btn)]">accessibles partout</span> et simplement.
                </h1>

                <p class="text-xl md:text-2xl mb-10 text-gray-700">
                    SilverNote est l'application de prise de notes simple et intuitive conçue pour vous, disponible sur mobile, PC et en tant qu'application web.
                </p>

                <div class=" flex flex-col sm:flex-row justify-center items-center">
                    <a href="https://app.silvernote.fr"><button class="primary m-4">Découvrir silvernote</button></a>
                    <button @click="scroll_to('function')" style="backdrop-filter: blur(50px);" class="second">En savoir plus</button>
                </div>

            </div>

        </div>

    </header>

    <section id="function" class="py-16 md:py-24 rounded-xl mx-4 mb-8 w-[calc(100vw_-_2rem)]">

        <div class="container mx-auto px-4 text-center max-w-8xl">

            <h2 class="text-4xl md:text-5xl font-bold mb-12 text-gray-900">Conçu pour votre productivité.</h2>

            <ul class="feature-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card 
                    v-for="(card, index) in function_list" 
                    :key="index"
                    :title="card.title"
                    :content="card.content"
                    :svg="card.svg"
                />
            </ul>

        </div>

    </section>

    <section id="price_plan" class="py-16 md:py-24 rounded-xl mx-4 mb-8 w-screen flex flex-col justify-center items-center relative">

        <div 
            class=" bg-[var(--bg)]/30 w-screen -ml-4 inset-0 absolute z-50 flex flex-col justify-center items-center text-6xl font-bold uppercase text-red-600"
            style="backdrop-filter: blur(3px);"
        >
            App en développement
            <span class="text-2xl mt-2">bientôt disponible</span>
        </div>

        <div class="container w-screen text-center saturate-0">

            <h2 class="text-4xl md:text-5xl font-bold mb-2 text-gray-900">Choisissez le plan qui vous convient.</h2>

            <div class="flex flex-row flex-wrap justify-center mt-6 mb-12 gap-20">

                <div class="inline-flex bg-[var(--bg3)] rounded-full p-2.5 gap-2 shadow-md">

                    <button
                        @click="selected_mode_for = 1"
                        :class="[
                            baseClass,
                            selected_mode_for === 1 ? activeClass : inactiveClass
                        ]"
                    >
                        Seul
                    </button>
                    <button
                        @click="selected_mode_for = 2"
                        :class="[
                            baseClass,
                            selected_mode_for === 2 ? activeClass : inactiveClass
                        ]"
                    >
                        Famille
                    </button>
                    <button
                        @click="selected_mode_for = 3"
                        :class="[
                            baseClass,
                            selected_mode_for === 3 ? activeClass : inactiveClass
                        ]"
                    >
                        Entreprise
                    </button>

                </div>

                <div 
                    style="transition: all 0.3s ease;"
                    :class="[ 
                        'inline-flex bg-[var(--bg3)] rounded-full p-2.5 gap-2 shadow-md',
                        selected_mode_for === 3 
                            ? ' contrast-90 text-gray-500'
                            : '' 
                    ]"
                >

                    <button
                        @click="selected_mode_date = 1"
                        :class="[
                            baseClass,
                            selected_mode_for === 3 
                                ? 'border-0 bg-transparent' 
                                : selected_mode_date === 1 ? activeClass : inactiveClass
                        ]"
                    >
                        Par mois
                    </button>
                    <button
                        @click="selected_mode_date = 2"
                        :class="[
                            baseClass,
                            selected_mode_for === 3 
                                ? 'border-0 bg-transparent' 
                                : selected_mode_date === 2 ? activeClass : inactiveClass
                        ]"
                    >
                        Par ans
                    </button>
                    <button
                        @click="selected_mode_for !== 2 ? selected_mode_date = 3 : selected_mode_date = selected_mode_date"
                        :class="[
                            baseClass,
                            selected_mode_for === 2
                                ? 'contrast-60 bg-[var(--bg3)] text-gray-600'
                                : selected_mode_for === 3 
                                    ? 'border-0 bg-transparent' 
                                    : selected_mode_date === 3 ? activeClass : inactiveClass
                        ]"
                    >
                        A vie
                    </button>

                </div>

            </div>

            <div class="flex flex-row flex-wrap justify-center items-start gap-8 w-full">

                <Pricing_card 
                    v-for="(plan, index) in pricing_plan_list"
                    :key="index"
                    :title="plan.title" 
                    :foru="plan.for" 
                    :price="plan.price" 
                    :recommended="plan.recommended" 
                    :functions="plan.functions" 
                    :mode_for="selected_mode_for"
                    :mode_date="selected_mode_date"
                    class="min-w-80 max-w-90"
                />
                
            </div>

        </div>

    </section>

    <section class="py-16 md:py-24 text-center rounded-xl mx-4 mb-8 w-[calc(100vw_-_2rem)]">

        <div class=" mx-auto px-4 max-w-4xl flex flex-col sm:flex-row ">

            <div class="mb-8 sm:mb-0">

                <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                    Prêt à simplifier vos notes ?
                </h2>

                <p class="text-xl md:text-2xl mb-10 text-gray-700">
                    Rejoignez des milliers d'utilisateurs et commencez à organiser votre vie avec SilverNote dès aujourd'hui.
                </p>

                <SignUpButton>
                    <button class="primary text-xl px-8 py-4">
                        Créer votre compte gratuit
                    </button>
                </SignUpButton>

            </div>

            <Swiper
                :slides-per-view="1"
                :space-between="10"
                :modules="modules"
                :loop="true"
                :autoplay="{
                    delay: 5000,
                    disableOnInteraction: false
                }"
                :pagination="{
                    clickable: true
                }"
                class="w-full"
            >

                <SwiperSlide>
                    <span class="text-2xl" style="letter-spacing: 2px;">silvernote - home</span>
                    <img src="/assets/img/phone_view_home_light.png" alt="" class="w-full h-auto object-contain" />
                    <div class="absolute bottom-0 left-0 right-0 h-10 bg-[var(--bg)]/70 backdrop:blur-2xl"></div>
                </SwiperSlide>

                <SwiperSlide>
                    <span class="text-2xl" style="letter-spacing: 2px;">silvernote - edit</span>
                    <img src="/assets/img/phone_view_edit_light.png" alt="" class="w-full h-auto object-contain" />
                    <div class="absolute bottom-0 left-0 right-0 h-10 bg-[var(--bg)]/70 backdrop:blur-2xl"></div>
                </SwiperSlide>

                <SwiperSlide>
                    <span class="text-2xl" style="letter-spacing: 2px;">silvernote - home</span>
                    <img src="/assets/img/phone_view_home_dark.png" alt="" class="w-full h-auto object-contain" />
                    <div class="absolute bottom-0 left-0 right-0 h-10 bg-[var(--bg)]/70 backdrop:blur-2xl"></div>
                </SwiperSlide>

                <SwiperSlide>
                    <span class="text-2xl" style="letter-spacing: 2px;">silvernote - edit</span>
                    <img src="/assets/img/phone_view_edit_dark.png" alt="" class="w-full h-auto object-contain" />
                    <div class="absolute bottom-0 left-0 right-0 h-10 bg-[var(--bg)]/70 backdrop:blur-2xl"></div>
                </SwiperSlide>

            </Swiper>

        </div>

    </section>

    <footer class="z-50 w-screen">

        <Footer />

    </footer>

</template>

<script lang="ts" setup>

import { ref } from 'vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';
const modules = [Autoplay, Pagination];

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { SignUpButton } from '@clerk/vue'

import Nav_bar from '../components/Nav_bar.vue';
import Card from '../components/Card.vue';
import Pricing_card from '../components/Pricing_card.vue'
import Footer from '../components/Footer.vue';


const selected_mode_for = ref<number>(1);
const selected_mode_date = ref<number>(1);
const baseClass = 'selector-btn px-4 py-2 text-sm cursor-pointer font-medium rounded-full transition-all duration-200';
const activeClass = 'bg-white shadow text-[var(--btn)] border-1 border-[var(--btn)] ';
const inactiveClass = 'text-gray-600 hover:text-[var(--btn)]';

const scroll_to = (id: 'function' | 'home' | 'price_plan') => {
    const element = document.getElementById(id)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
}


const function_list: { title: string, content: string, svg: string }[] = [
    { 
        title: 'Multi-plateforme', 
        content: "<span class=\"underline\">Accédez</span> à vos notes depuis <span class=\"underline\">n'importe</span> quel appareil : smartphone, tablette, ordinateur de bureau ou navigateur web.", 
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid-white"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>` 
    },
    { 
        title: 'Synchronisation Cloud', 
        content: "Vos notes sont automatiquement <span class=\"underline\">synchronisées</span> et <span class=\"underline\">sauvegardées</span> en toute <span class=\"underline\">sécurité</span> dans le cloud.", 
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h3.79a4.5 4.5 0 1 1 0 9Z"/></svg>` 
    },
    { 
        title: 'Simple et intuitive', 
        content: "Une <span class=\"underline\">interface</span> épurée pour une prise de notes <span class=\"underline\">rapide</span> et sans distraction.", 
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-feather"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5.64 10.35a2 2 0 1 0 2.83 2.83L14.7 6.34a2 2 0 1 1 2.83 2.83L9.35 15.66a4 4 0 1 0 5.66 5.66L20.24 12.24z"/></svg>` 
    },
    { 
        title: 'Organisation facile', 
        content: "<span class=\"underline\">Organisez</span> vos notes en les épinglant, en les classant par dossier et par couleur, pour une <span class=\"underline\">gestion</span> <span class=\"underline\">optimale</span>.", 
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-text"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/></svg>` 
    }
]


const pricing_plan_list: { 
    title: string, 
    for: string, 
    price: number, 
    functions: { 
        name: string, 
        includ: boolean 
    }[], 
    recommended: boolean 
}[] = [
    {
        title: "Silver",
        for: "Utilisateurs désirant tester la <span class=\"underline\">simplicité</span> de silvernote.",
        price: 0,
        functions: [
            { name: "jusqu'a 50 notes", includ: true },
            { name: "jusqu'a 20 dossiers", includ: true },
            { name: "mode hors ligne", includ: false },
            { name: "notes chiffrées", includ: false },
        ],
        recommended: false,
    },
    {
        title: "Gold",
        for: "Utilisateurs confirmé désirant plus de <span class=\"underline\">sécurité</span>.",
        price: 5, // + 0.99
        functions: [
            { name: "jusqu'a 150 notes", includ: true },
            { name: "jusqu'a 50 dossiers", includ: true },
            { name: "mode hors ligne", includ: true },
            { name: "notes chiffrées", includ: true },
        ],
        recommended: true,
    },
    {
        title: "Platinum",
        for: "Utilisateurs avancé, avec une offre <span class=\"underline\">sans</span> <span class=\"underline\">prise de tête</span>.",
        price: 10, // + 0.99
        functions: [
            { name: "jusqu'a 1000 notes", includ: true },
            { name: "jusqu'a 100 dossiers", includ: true },
            { name: "mode hors ligne", includ: true },
            { name: "notes chiffrées", includ: true },
        ],
        recommended: false,
    },
    {
        title: "Ultimate",
        for: "Utilisteurs désirant l'<span class=\"underline\">éxcélence</span> d'une offre <span class=\"underline\">illimité</span> !",
        price: 19, // + 0.99
        functions: [
            { name: "notes illimités", includ: true },
            { name: "dossiers illimités", includ: true },
            { name: "mode hors ligne", includ: true },
            { name: "notes chiffrées", includ: true },
        ],
        recommended: false,
    }
]

</script>
