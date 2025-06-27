<template>

    <div 
        :class="recommended 
                    ? 'pricing-card bg-[var(--bg2)] p-8 rounded-2xl shadow-lg border-2 border-[var(--btn)] scale-105 flex flex-col justify-between relative hover:shadow-xl transition-shadow duration-300'
                    :'pricing-card bg-[var(--bg2)] p-8 rounded-2xl shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow duration-300'
                "
    >

        <div 
            v-if="recommended" 
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--btn)] text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md"
        >
            Recommandé
        </div>

        <div>

            <h3 class="text-3xl font-bold mb-4 text-gray-900">{{ title }}</h3>
            <p class="text-gray-600 mb-6">{{ for }}</p>

            <div class="text-5xl font-extrabold text-[var(--btn)] mb-6">
                {{ price == -1 ? "Contactez nous" : `${price * mode_for}€` }}
                <span v-if="price != -1" class="text-xl font-normal text-gray-500">
                    {{ mode_date == 1 ? '/ mois' : mode_date == 2 ? '/ ans' : 'a vie' }}
                </span>
            </div>

            <ul class="text-left text-gray-700 space-y-3 mb-8">

                <li 
                    class="flex items-center" 
                    v-for="(potato, index) in functions"
                    :key="index"
                >
                    <svg v-if="potato.includ" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500 mr-2"><polyline points="20 6 9 17 4 12"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x text-red-400 mr-2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    {{ potato.name }}
                </li>

            </ul>

        </div>

        <button class="second w-full">{{ price == 0 ? 'Commencer gratuitement' : `Passer au plan ${title}` }}</button>

    </div>

</template>

<script lang="ts" setup>

defineProps<{
    title: string;
    for: string;
    price: number;
    functions: { name: string, includ: boolean }[];
    recommended: boolean;
    mode_for: number;
    mode_date: number;
}>()

</script>