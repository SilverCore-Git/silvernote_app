<script setup lang="ts">
import Service_card from '@/components/Service_card.vue';
import home_config from '../../config/home_config.json';
const services = home_config.services;
</script>

<template>

    <section 
        class="flex justify-center items-center flex-col text-center pt-[13%]"
    >

        <div 
            class="mb-10"
        >
            <h2 class="text-[50px] font-bold">{{ services.title }}</h2>
            <p class="">
                {{ services.description }}
            </p>
        </div>

        <div
            class="
                    flex justify-center items-center
                    flex-wrap max-w-6xl gap-4
                "
        >

            <Service_card
                v-for="service in services.services"
                :prop="service"
            />

        </div>

    </section>

</template>

<style scoped>
.parent_nos_service {
    height: 100%;
    width: 100%;
    padding-top: 100px;
    padding-bottom: 100px;
}
</style>