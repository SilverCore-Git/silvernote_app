<template>

    <div 
        v-if="mode_for !== 1 ? title !== 'Silver' : true"
        :class="recommended && mode_for != 3 
                    ? 'max-w-90 min-w-90 pricing-card bg-[var(--bg2)] p-8 rounded-2xl shadow-lg border-2 border-[var(--btn)] scale-105 flex flex-col justify-between relative hover:shadow-xl transition-shadow duration-300'
                    :'max-w-90 min-w-90 pricing-card bg-[var(--bg2)] p-8 rounded-2xl shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow duration-300'
                "
    >

        <div 
            v-if="recommended && mode_for != 3" 
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--btn)] text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md"
        >
            Recommandé
        </div>

        <div>

            <h3 class="text-3xl font-bold mb-4 text-gray-900">
                {{ title }} {{ mode_for == 2 ? 'famille' : mode_for == 3 ? 'entreprise' : '' }}
            </h3>

            <p class="text-gray-600 mb-6" v-html="foru"></p>

            <div class="text-5xl font-extrabold text-[var(--btn)] mb-6">

                {{ mode_for === 3 ? "Nous contacter" : ReelPrice }}

                <span v-if="title !== 'Silver' && mode_for !== 3" class="text-lg -ml-3">.99</span>
                <span v-if="mode_for !== 3">€</span>

                <span v-if="price != -1" class="text-xl font-normal text-gray-500">
                    
                    {{ title == 'Silver' ? "" : mode_for != 3 ? mode_date == 1 ? '/ mois' : mode_date == 2 ? '/ ans' : 'a vie' : '' }}

                </span>

            </div>

            <ul class="text-left text-gray-700 space-y-3 mb-8">

                <li 
                    v-if="mode_for == 2"
                    class="flex items-center" 
                >
                    <svg  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500 mr-2"><polyline points="20 6 9 17 4 12"/></svg>
                    jusqu'a 5 utilisateurs
                </li>

                <li 
                    v-if="mode_date == 3"
                    class="flex items-center" 
                >
                    <svg  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500 mr-2"><polyline points="20 6 9 17 4 12"/></svg>
                    mise à jours incluse
                </li>

                <li 
                    class="flex items-center" 
                    v-for="(potato, index) in functions"
                    :key="index"
                >
                    <svg v-if="potato.includ" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500 mr-2"><polyline points="20 6 9 17 4 12"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x text-red-400 mr-2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    {{ potato.name }} {{ mode_for > 1 ? 'par utilisateurs' : '' }}
                </li>

            </ul>

        </div>

        <button 
            @click="onClick()"
            class="second w-full"
        >
            {{ price == 0 ? 'Commencer gratuitement' : mode_for == 3 ? `Nous contacter` : `S'inscrir au plan ${title}` }}
        </button>

    </div>

</template>

<script lang="ts" setup>

import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { pricing_plan_prices } from '../assets/config';
import { openApp } from '../assets/utils';

const router = useRouter();

const onClick = () => 
    props.title == 'Silver' 
        ? openApp(false) 
        : router.push(`/pay/pricing/${props.title}?mode=${props.mode_date == 3 ? 'payment' : 'subscription'}&each=${props.mode_date == 1 ? "month" : props.mode_date == 2 ? 'year' : 'life'}&family=${props.mode_for == 2}`)

const props = defineProps<{
  title: string; 
  price: number;
  foru: string;
  functions: { name: string; includ: boolean }[];
  recommended: boolean;
  mode_for: number; 
  mode_date: number;
}>();

const theyPrice = pricing_plan_prices[props.title];

const ReelPrice = ref<number | null>(0);

const set_realPrice = () => {
    ReelPrice.value = props.mode_for === 1 
    ? props.mode_date === 1
      ? theyPrice.solo.mounth
      : props.mode_date === 2
        ? theyPrice.solo.year
        : theyPrice.solo.life
    : props.mode_date === 1
      ? theyPrice.family.mounth
      : props.mode_date === 2
        ? theyPrice.family.year
        : null;
}

set_realPrice();
watch(() => props.mode_for, () => { set_realPrice() });
watch(() => props.mode_date, () => { set_realPrice() });

</script>