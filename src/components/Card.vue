<template>

    <div class="max-w-100 bg-[var(--bg2)] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">

        <div class="flex justify-center items-center flex-row space-x-4">

            <div v-html="svg" class="text-[var(--btn)] text-5xl mb-4"></div>
            <h3 class="text-2xl font-semibold mb-3 text-gray-800">{{ title }}</h3>

        </div>

        <p class="text-gray-600" v-html="content"></p>

    </div>

</template>

<script lang="ts" setup>

defineProps<{
    title: string;
    content: string;
    svg: string;
}>()

</script>