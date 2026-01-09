<script setup lang="ts">

import FilterCard from './FilterCard.vue';
import { Tags } from '@/assets/ts/database/Var';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { FreeMode } from 'swiper/modules';

import 'swiper/css';
import useFilter from '../../composables/useFilter';

const { toggleFilter, isSelected } = useFilter();

</script>

<template>

    <div
        class="
            flex flex-row justify-start items-center
            pl-1 gap-4 w-full
        "
    >

        <span class=" uppercase opacity-60 text-sm whitespace-nowrap">Filtres :</span>

        <ul
            class="flex flex-row justify-center items-center gap-4 overflow-x-auto "
        >
            <Swiper
                :slides-per-view="'auto'"
                :space-between="8"
                :free-mode="true"
                :modules="[FreeMode]"
                v-if="Tags && Tags.length"
                class="
                    w-full cursor-grab
                "
            >
                <SwiperSlide
                    v-for="(tag, index) in Tags"
                    :key="index"
                    class="!w-auto"
                >
                    <FilterCard
                        :color="tag.color"
                        :name="tag.name"
                        :active="isSelected(tag.id)"
                        @click.stop="toggleFilter(tag.id)"
                    />
                </SwiperSlide>
            </Swiper>
            
            <li>
                <div
                    class="
                        bg-(--white) border border-(--btn) border-dashed
                        flex justify-center items-center gap-1 flex-row
                        px-3 py-1.5 text-(--btn) rounded-2xl cursor-pointer
                        min-w-18
                    "
                >
                    
                    <span  class=" text-xs">
                        <i class="bi bi-plus" />
                        Filtre
                    </span>
                </div>
            </li>

        </ul>

    </div>

</template>