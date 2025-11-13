<template>

    <div
        v-fade
        class="
            service_card flex justify-start gap-6 h-[350px]
            items-start text-start flex-col p-6 max-w-100
        "
    >

        <i class="bi" :class="prop.icon"></i>

        <h3 class="text-[22px] font-bold">{{ prop.title }}</h3>

        <p class="text-[16px]">
            {{ prop.content }}
        </p>

    </div>

</template>

<script lang="ts" setup>

import type { Politique } from '../assets/ts/types';
defineProps<{
    prop: Politique
}>();

</script>

<style scoped>

.service_card {
    background-color: rgba(255, 255, 255, 0.06);

    border: 1.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}

</style>