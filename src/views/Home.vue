<template>

    <header class="absolute top-3 right-0 left-0">
        <Nav_bar />
    </header>

    
    <section id="home" class="flex justify-center items-center flex-col">

        <h1 class=" uppercase font-bold " style="letter-spacing: 2px;">silvernote</h1>
        <h2 class=" text-2xl uppercase font-bold" style="letter-spacing: 9.5px;"><i class="text-[var(--btn)]">simple</i> et <i class="text-[var(--btn)]">cool</i></h2>



  <swiper class="w-full" :spaceBetween="0" :slidesPerView="3" loop>
    <swiper-slide>
      <img src="/assets/img/banner.jpg" alt="Banner 1" class="w-full h-auto" />
    </swiper-slide>
    <swiper-slide>
      <img src="/assets/img/banner.jpg" alt="Banner 2" class="w-full h-auto" />
    </swiper-slide>
    <swiper-slide>
      <img src="/assets/img/banner.jpg" alt="Banner 3" class="w-full h-auto" />
    </swiper-slide>
    <swiper-slide>
      <img src="/assets/img/banner.jpg" alt="Banner 4" class="w-full h-auto" />
    </swiper-slide>
    <swiper-slide>
      <img src="/assets/img/banner.jpg" alt="Banner 5" class="w-full h-auto" />
    </swiper-slide>
  </swiper>

    </section>


</template>

<script lang="ts" setup>

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import Nav_bar from '../components/Nav_bar.vue';

</script>