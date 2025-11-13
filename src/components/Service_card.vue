<template>

    <div
        v-fade
        class="
            service_card flex justify-start gap-6
            items-start text-start flex-col p-6 h-[620px]
        "
    >

        <div class="flex flex-row gap-4">
            <img :src="prop.logo" class="rounded-lg w-[35px] h-[35px]" />
            <span class="text-2xl">{{ prop.name }}</span>
        </div>

        <h3 class=" font-bold text-3xl">{{ prop.title }}</h3>
        <p class=" text-gray-300">
            {{ prop.description }}
        </p>

        <SButton 
            :content="prop.btn.content"
            :bg-color="prop.btn.color"
            :href="prop.btn.href"
        />

        <div
            class="
                max-h-[340px] w-[497px]
                flex justify-center items-center relative
            "
        >
            <img 
                :src="prop.baner"
                class="object-cover object-center"   
            />
        </div>


    </div>

</template>

<script lang="ts" setup>

import type { Service } from '@/assets/ts/types';
import SButton from '@/components/SButton.vue';
defineProps<{
    prop: Service
}>();

</script>

<style scoped>

.service_card {
    background-color: rgba(255, 255, 255, 0.06);

    min-height: 500px;
    width: 540px;

    border: 1.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}

</style>