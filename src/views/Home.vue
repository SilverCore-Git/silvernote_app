<template>

  <header class="absolute top-0 left-0 w-full z-50 bg-[var(--bg2)] ">

    <Nav_bar />

  </header>

    <main class=" relative h-screen w-screen flex flex-col justify-center items-center text-center ">

            <h1 class="text-5xl sm:text-6xl font-extrabold uppercase tracking-widest text-gray-900">
                Silvernote
            </h1>

            <h2 class="mt-4 text-2xl sm:text-3xl font-semibold uppercase tracking-[0.5em] text-gray-700">

                <i class="text-[var(--btn)]">Simple</i> et <i class="text-[var(--btn)]">Cool</i>

            </h2>

            <p class="mt-6 max-w-xl text-gray-500 text-lg">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. A ipsam quaerat deserunt odit praesentium quod! Exercitationem suscipit perspiciatis libero fugit nulla molestias beatae, a numquam ex delectus, quis laboriosam maxime.
            </p>

            <div class="mt-8">

                <button class="second mr-5" >Découvrir Silvernote</button>
                <button class="primary" >Essayer gratuitement</button>

            </div>

    </main>

    <section class="w-screen flex flex-col items-center justify-center">

        <h2 class="text-3xl sm:text-4xl font-bold mb-8 text-center">
            Interface simple et épurée
        </h2>

        <Swiper
            :slides-per-view="3"
            :space-between="30"
            class="w-[70%]"
            
        >

            <SwiperSlide class="w-[20%]">
                <img
                    src="/assets/img/banner.jpg"
                    alt="Aperçu interface"
                    class="w-full h-auto rounded-lg shadow-md object-cover"
                />
            </SwiperSlide>

            <SwiperSlide class="w-[20%]">
                <img
                    src="/assets/img/banner.jpg"
                    alt="Aperçu interface"
                    class="w-full h-auto rounded-lg shadow-md object-cover"
                />
            </SwiperSlide>

            <SwiperSlide class="w-[20%]">
                <img
                    src="/assets/img/banner.jpg"
                    alt="Aperçu interface"
                    class="w-full h-auto rounded-lg shadow-md object-cover"
                />
            </SwiperSlide>

        </Swiper>

    </section>


</template>

<script lang="ts" setup>

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import Nav_bar from '../components/Nav_bar.vue';

</script>
