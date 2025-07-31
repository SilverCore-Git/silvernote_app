<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

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
                    <br>Projet en développement, beta gratuite disponible.
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

    <section id="price_plan" class="py-16 md:py-24 rounded-xl mx-4 mb-8 flex flex-col justify-center items-center relative">

        <!-- <div 
            class=" bg-[var(--bg)]/30 w-screen -ml-4 inset-0 absolute z-30 flex flex-col justify-center items-center text-6xl font-bold uppercase text-red-600 text-center"
            style="backdrop-filter: blur(3px);"
        >
            beta gratuite disponible
            <span class="text-2xl mt-2">abonnement a venir</span>
        </div> -->

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
                    Tester SilverNote dès aujourd'hui, dans un navigateur.
                </p>

                <SignedIn>
                    <a href="https://app.silvernote.fr"><button class="primary text-xl px-8 py-4">
                        Ouvrir silvernote
                    </button></a>
                </SignedIn>

                <SignedOut>
                    <SignUpButton>
                        <button class="primary text-xl px-8 py-4">
                            Créer votre compte gratuit
                        </button>
                    </SignUpButton>
                </SignedOut>

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

import { SignedIn, SignedOut, SignUpButton } from '@clerk/vue'

import { pricing_plan_list, function_list } from '../assets/config';
import { scroll_to } from '../assets/utils';

import Nav_bar from '../components/Nav_bar.vue';
import Card from '../components/Card.vue';
import Pricing_card from '../components/Pricing_card.vue'
import Footer from '../components/Footer.vue';


const selected_mode_for = ref<number>(1);
const selected_mode_date = ref<number>(1);
const baseClass = 'selector-btn px-4 py-2 text-sm cursor-pointer font-medium rounded-full transition-all duration-200';
const activeClass = 'bg-white shadow text-[var(--btn)] border-1 border-[var(--btn)] ';
const inactiveClass = 'text-gray-600 hover:text-[var(--btn)]';


</script>
