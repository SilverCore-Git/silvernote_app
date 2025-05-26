<template>

    <div 
        @click="active=!active" 
        :id="active ? `${tag}-active` : tag"
        :class="active ? 'p-0.5 text-center border-3 border-[#F28C28] cursor-pointer' : 'p-1 text-center border-1 cursor-pointer'" style="border-radius: 15px;"
    >
        <span>{{ name }}</span>
    </div>

</template>

<script lang="ts" setup>

import { ref } from 'vue';

const active = ref<boolean>(false);


defineProps<{
    name: string,
    tag: string
}>()

</script>