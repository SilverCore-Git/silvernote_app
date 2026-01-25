<script setup lang="ts">

import FilterCard from './FilterCard.vue';
import { Tags } from '@/assets/ts/database/Var';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { FreeMode } from 'swiper/modules';
import { ref } from 'vue';

import 'swiper/css';
import useFilter from '../../composables/useFilter';
import NewTagPopup from './NewTagPopup.vue';

const { toggleFilter, isSelected } = useFilter();
const ShowNewTagPopup = ref<boolean>(false);

</script>

<template>

    <div
        class="
            flex flex-col justify-start items-center
            pl-1 gap-4 w-full 
        "
    >

        <div 
            class="flex md:hidden items-center w-full"
            :class="Tags.length ? 'justify-between' : 'justify-start'"
        >

            <span 
                class=" uppercase opacity-60 text-sm whitespace-nowrap"
            >Tags :</span>

            <div
                class="
                    bg-(--white) border border-(--btn) border-dashed
                    flex justify-center items-center gap-1 flex-row
                    px-3 py-1.5 rounded-2xl cursor-pointer
                    min-w-18 hover:text-(--btn)
                    transition-all duration-200 ease-in-out
                "
                @click="ShowNewTagPopup = true"
            >
                
                <span  class=" text-xs">
                    <i class="bi bi-plus" />
                    Tag
                </span>
            </div>

        </div>

        <ul
            class="
                flex flex-row justify-center items-center
                gap-4 overflow-x-auto w-full 
            "
        >

            <li class="md:block hidden">
                <span class=" uppercase opacity-60 text-sm whitespace-nowrap">Filtres :</span>
            </li>

            <Swiper
                :slides-per-view="'auto'" 
                :space-between="8"
                :free-mode="true"
                :modules="[FreeMode]"
                :observer="true"
                :observe-parents="true"
                :watch-overflow="true"
                class="w-full cursor-grab rounded-lg"
                v-if="Tags && Tags.length"
            >
                <SwiperSlide
                    v-for="tag in Tags"
                    :key="tag.id"
                    class="!w-auto"
                    @click.stop="toggleFilter(tag.id)"
                >
                    <FilterCard
                        :uuid="tag.uuid"
                        :color="tag.color"
                        :name="tag.name"
                        :active="isSelected(tag.id)"
                    />
                </SwiperSlide>
            </Swiper>

            <li class="md:block hidden">
                <div
                    class="
                        bg-(--white) border border-(--btn) border-dashed
                        flex justify-center items-center gap-1 flex-row
                        px-3 py-1.5 rounded-2xl cursor-pointer
                        min-w-18 hover:text-(--btn)
                        transition-all duration-200 ease-in-out
                    "
                    @click="ShowNewTagPopup = true"
                >

                    <span  class=" text-xs">
                        <i class="bi bi-plus" />
                        Filtre
                    </span>
                </div>
            </li>

        </ul>

    </div>

    <Teleport to="body">

        <Transition name="fade-slide">

            <NewTagPopup 
                v-if="ShowNewTagPopup"
                @close="ShowNewTagPopup = false"
            />

        </Transition>

    </Teleport>

</template>