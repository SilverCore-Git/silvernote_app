<script setup lang="ts">
import home_config from '../../config/home_config.json';
import Politique_card from '../../components/Politique_card.vue';
const politiques = home_config.politiques;
</script>

<template>

    <section 
        class="flex justify-center items-center flex-col text-center pt-[13%]"
    >

        <div 
            class="mb-10"
        >
            <h2 class="text-[50px] font-bold">{{ politiques.title }}</h2>
            <p class="">
                {{ '' }}
            </p>
        </div>

        <div
            class="
                    flex justify-center items-center
                    flex-wrap max-w-8xl gap-4
                "
        >

            <Politique_card
                v-for="service in politiques.politique"
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