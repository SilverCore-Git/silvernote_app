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

    <Multi_platform />

    <SilverAI />

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
import SilverAI from '../components/section/SilverAI.vue';
import Multi_platform from '../components/section/Multi_platform.vue';


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