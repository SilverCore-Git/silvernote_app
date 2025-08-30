<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

        <Nav_bar />

    </nav>

    <header 
        id="home"
        class=" bg-cover bg-center rounded-xl my-8 w-[calc(100vw_-_2rem)] mx-4 h-160 mt-26" 
        style="background-image: url('/assets/img/hero_baner.jpg');"
    >

        <div class="w-full h-160 rounded-xl text-center py-10 md:py-25 xl:py-10" style="backdrop-filter: blur(8px) contrast(80%) brightness(200%);">

            <div class="mx-auto flex justify-center items-center flex-row">

                <div class="max-w-4xl">

                    <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
                        Vos notes <span class="text-[var(--btn)]">accessibles partout</span> et simplement.
                    </h1>

                    <p class="text-xl md:text-2xl mb-10 text-gray-700">
                        SilverNote est l'application de prise de notes simple et intuitive conçue pour vous, disponible sur mobile, PC et en tant qu'application web.
                        <br>Projet en développement, beta gratuite disponible.
                    </p>

                    <div class=" flex flex-col sm:flex-row justify-center items-center">
                        
                        <a href="https://app.silvernote.fr"><button class="premium m-4">Découvrir silvernote</button></a>
                        
                        <div class="hidden">
                            <a href="https://app.silvernote.fr"><button class="primary m-4">Ouvrir silvernote</button></a>
                            <button @click="scroll_to('function')" style="backdrop-filter: blur(50px);" class="second">En savoir plus</button>
                        </div>

                    </div>

                </div>

                <div >

                    <img src="/assets/img/phone_note.png" class="h-140 hidden xl:block" />

                </div>

            </div>


        </div>

    </header>

    <section id="function" class="py-16 md:py-24 mb-8 px-4 w-screen ">

        <div class=" px-4 text-center w-full ">
            
            <h2 class="text-4xl md:text-5xl font-bold mb-12 text-gray-900">
                Conçu pour votre productivité.
            </h2>

            <div class="flex justify-center items-center mx-auto w-full gap-10 
                         flex-col  md:flex-row xl:gap-0">

                <ul class="flex justify-between items-center flex-col h-175 ">
                    <Card 
                        v-for="(card, index) in function_list.slice(0, 3)" 
                        :key="index"
                        :title="card.title"
                        :content="card.content"
                        :svg="card.svg"
                    />
                </ul>

                <spline-viewer class="h-200 w-[40%] hidden xl:block " url="https://prod.spline.design/WvISayiZp5mUaMsS/scene.splinecode"></spline-viewer>

                <ul class="flex justify-between items-center flex-col h-175 ">
                    <Card 
                        v-for="(card, index) in function_list.slice(-3)" 
                        :key="index"
                        :title="card.title"
                        :content="card.content"
                        :svg="card.svg"
                    />
                </ul>

            </div>

        </div>
        
    </section>

    <section id="jeremy" class="py-16 md:py-24 mx-4 mb-8 w-[calc(100vw_-_2rem)]">

        <div class="container mx-auto px-4 max-w-6xl">

            <h2 class="text-4xl md:text-5xl font-bold mb-28 text-center text-gray-900">
                Jeremy, votre assistant IA.
            </h2>

            <div class="flex flex-col lg:flex-row items-center justify-between h-[700px] gap-12">

                <div class="flex gap-20 md:justify-between items-start h-full flex-col lg:w-1/2 text-center lg:text-left ">

                    <p class="text-xl md:text-2xl">
                        Fatigué de perdre du temps à organiser vos idées ?
                        Jeremy est là pour ça !  <br />
                        Notre assistant intelligent, est directement intégré à <span class="text-[var(--btn)] font-bold">SilverNote</span> 
                        pour transformer la manière dont vous travaillez.
                    </p>

                    <ul class="space-y-4 text-left text-lg">

                        <li class="flex items-start flex-col">
                            
                            <div class="flex justify-center items-center flex-row">
                                <svg class="flex-shrink-0 w-6 h-6 mr-3 text-[var(--btn)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span class="font-bold text-[var(--btn)]">Rédaction assistée :</span> 
                            </div>
                            
                            <p>Laissez Jeremy vous aider à formuler vos pensées, à corriger vos textes, ou même à générer des brouillons.</p>
                        
                        </li>

                        <li class="flex items-start flex-col">
                            
                            <div class="flex justify-center items-center flex-row">
                                <svg class="flex-shrink-0 w-6 h-6 mr-3 text-[var(--btn)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span class="font-bold text-[var(--btn)]">Synthèse de contenu :</span> 
                            </div>
                            
                            <p>Importez de longs documents ou articles et demandez à Jeremy de les résumer pour vous en quelques secondes.</p>
                        
                        </li>

                        <li class="flex items-start flex-col">
                            
                            <div class="flex justify-center items-center flex-row">
                                <svg class="flex-shrink-0 w-6 h-6 mr-3 text-[var(--btn)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span class="font-bold text-[var(--btn)]">Brainstorming intelligent :</span> 
                            </div>
                            
                            <p>Lancez-vous dans une session de réflexion avec Jeremy pour explorer de nouvelles idées et structurer vos projets.</p>
                        
                        </li>

                    </ul>

                    <!-- <a href="https://app.silvernote.fr/jeremy" class="inline-block mt-8">
                        <button class="premium px-8 py-4 text-lg">
                            Découvrir Jeremy
                        </button>
                    </a> -->

                </div>

                <div class="lg:w-1/2 mt-8 lg:mt-0 hidden lg:block">

                    <div class="relative w-[355px] h-[700px] overflow-hidden ">
                        <img 
                            src="/assets/img/jeremy_mockup.png" 
                            class="absolute inset-0 w-[355px] h-[700px] object-contain "   
                        />
                    </div>

                </div>

            </div>

        </div>
        
    </section>


    <section v-if="we_can_buy" id="price_plan" class="py-16 md:py-24 rounded-xl mx-4 mb-8 flex flex-col justify-center items-center relative">

        <div class="container w-screen text-center ">

            <h2 class="text-4xl md:text-5xl font-bold mb-2 text-gray-900">Choisissez le plan qui vous convient.</h2>

            <div class="flex flex-row flex-wrap justify-center mt-12 gap-10">

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

            <div class="hidden lg:flex flex-row justify-center items-center gap-8 h-160 w-full pl-140 2xl:pl-0  overflow-x-auto">

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

            <div class="flex lg:hidden flex-row justify-center items-center w-full mt-12 ">

                <Swiper 
                    :slides-per-view="1"
                    :space-between="10"
                    :modules="modules"
                    :loop="true"
                    navigation
                    :autoplay="{
                        delay: 3000,
                        disableOnInteraction: true
                    }"
                    :pagination="{
                        clickable: true
                    }"
                    class="w-full h-140 flex justify-center"

                >

                    <SwiperSlide
                        v-for="(plan, index) in pricing_plan_list"
                        :key="index"
                        class="w-full h-full"
                    >
                        <Pricing_card 
                            :title="plan.title" 
                            :foru="plan.for" 
                            :price="plan.price" 
                            :recommended="plan.recommended" 
                            :functions="plan.functions" 
                            :mode_for="selected_mode_for"
                            :mode_date="selected_mode_date"
                            class="min-w-80 max-w-90 mx-auto mt-8"
                        />
                    </SwiperSlide>
                    
                </Swiper>

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
                    <br>Accédez à toutes les fonctionnalités de notre version beta gratuite, et découvrez comment nous pouvons vous aider à organiser vos idées, vos tâches et vos projets.
                </p>

                <spline-viewer class="h-130 w-full  hidden md:block" url="https://prod.spline.design/kSS6nnpDc-RxdMGo/scene.splinecode"></spline-viewer>


                <div class="block md:hidden">

                    <SignedIn>
                        <a href="https://app.silvernote.fr"><button class="premium text-xl px-8 py-4">
                            Ouvrir silvernote
                        </button></a>
                    </SignedIn>

                    <SignedOut>
                        <SignUpButton>
                            <button class="premium text-xl px-8 py-4">
                                Créer votre compte gratuit
                            </button>
                        </SignUpButton>
                    </SignedOut>

                </div>

            </div>
<!-- 
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

            </Swiper> -->

        </div>

    </section>

    <footer class="z-50 w-screen">

        <Footer />

    </footer>

</template>

<script lang="ts" setup>

import { ref } from 'vue';

import '@splinetool/viewer';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
const modules = [Autoplay, Pagination, Navigation];

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { pricing_plan_list, function_list, we_can_buy } from '../assets/config';
import { scroll_to } from '../assets/utils';

import Nav_bar from '../components/Nav_bar.vue';
import Card from '../components/Card.vue';
import Pricing_card from '../components/Pricing_card.vue'
import Footer from '../components/Footer.vue';
import { SignedIn, SignedOut } from '@clerk/vue';


const selected_mode_for = ref<number>(1);
const selected_mode_date = ref<number>(1);
const baseClass = 'selector-btn px-4 py-2 text-sm cursor-pointer font-medium rounded-full transition-all duration-200';
const activeClass = 'bg-white shadow text-[var(--btn)] border-1 border-[var(--btn)] ';
const inactiveClass = 'text-gray-600 hover:text-[var(--btn)]';


</script>

<style>

.swiper-button-prev,
.swiper-button-next {
    color: var(--btn);
}

</style>