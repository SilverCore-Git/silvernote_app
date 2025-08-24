<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

        <Nav_bar />

    </nav>


    <main id="main" class="flex flex-col items-center justify-center text-center w-screen mt-50 mb-20">


        <h2 class="text-3xl md:text-5xl font-bold uppercase mb-10 ">
            silvernote <span class="text-[var(--btn)]">{{ plans[priceId].name }}</span> dès <span class="text-[var(--btn)]">{{ formattedPrice }}</span>{{ parsedEach }}
        </h2>

        <SignedOut>
            <SignInButton><button v-if="!isLoader" @click="create_checkout()" class="premium mt-5">
                Rejoindre le clan {{ plans[priceId].name }}
            </button></SignInButton>
        </SignedOut>

        <SignedIn>
            <button v-if="!isLoader" @click="create_checkout()" class="premium mt-5">
                Rejoindre le clan {{ plans[priceId].name }}
            </button>
        </SignedIn>

        <Loader v-if="isLoader" :icon="false" />

    </main>

    <!-- <div class="w-screen flex justify-center mt-30">
        <div @click="scroll_to('more')" class="w-12 arrow tooltip " data-tooltip="Plus d'info !">
            <svg fill="#000000" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><path d="M81.8457,25.3876a6.0239,6.0239,0,0,0-8.45.7676L48,56.6257l-25.396-30.47a5.999,5.999,0,1,0-9.2114,7.6879L43.3943,69.8452a5.9969,5.9969,0,0,0,9.2114,0L82.6074,33.8431A6.0076,6.0076,0,0,0,81.8457,25.3876Z"/></svg>
        </div>
    </div> -->

    <section id="more" class="flex flex-col items-center justify-center max-w-4xl mx-auto text-center text-[var(--text)] space-y-12 pt-20 mb-50">

        <h1 class=" font-extrabold uppercase tracking-tight leading-tight">
            Plus d'info !
        </h1>

        <p class="text-xl md:text-2xl max-w-2xl text-[var(--text)]">{{ plans[priceId].hook }}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

            <div 
                v-for="(asset,  index) of plans[priceId].assets"
                :key="index"
                class="bg-[var(--bg3)] p-8 rounded-lg shadow-md text-left"
            >

                <h3 class="text-3xl font-bold text-[var(--btn)] mb-4">{{ asset.title }}</h3>
                <p class="text-lg text-[var(--text)]">{{ asset.description }}</p>

            </div>

        </div>

        <SignedOut>
            <SignInButton><button v-if="!isLoader" class="premium mt-5">
                Rejoindre le clan {{ plans[priceId].name }}
            </button></SignInButton>
        </SignedOut>

        <SignedIn>
            <button v-if="!isLoader" @click="create_checkout()" class="premium mt-5">
                Rejoindre le clan {{ plans[priceId].name }}
            </button>
        </SignedIn>

    </section>

    <footer class="z-50 w-screen">
        <Footer />
    </footer>

</template>

<script lang="ts" setup>

import { useRoute } from 'vue-router';
import Footer from '../../components/Footer.vue'
import Nav_bar from '../../components/Nav_bar.vue'
import Loader from '../../components/Loader.vue';
import { onMounted, ref } from 'vue';

import { plans, pricing_plan_prices } from '../../assets/config';
import { scroll_to } from '../../assets/utils';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/vue';

const route = useRoute();
const { user } = useUser();

const props = defineProps<{
    priceId: 'Gold' | 'Platinum' | 'Ultimate'
}>()

const isLoader = ref<boolean>(false);
const each = route.query.each;

const parsedEach = each == 'month' ? '/mois' : each == 'year' ? '/ans' : '';
const isFamily: boolean = route.query.family == 'true' ? true : false;

const theyPrice = pricing_plan_prices[props.priceId];
const reelPrice: number | null = !isFamily 
    ? each == 'month'
      ? theyPrice.solo.mounth
      : each == 'year'
        ? theyPrice.solo.year
        : theyPrice.solo.life
    : each == 'month'
      ? theyPrice.family.mounth
      : each == "year"
        ? theyPrice.family.year
        : null;
const price: number = Number(`${reelPrice}99`);

const formattedPrice = (price / 100).toLocaleString('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});
const mode = route.query.mode; // 'payment' or 'subscription'



const create_checkout = async (): Promise<void> => {

    isLoader.value = true;

    try {

        const response = await fetch(
            `https://api.silvernote.fr/money/create/checkout/link/for/${props.priceId}/withmode/${mode}`,
            { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name: plans[props.priceId].name, 
                    description: plans[props.priceId].hook, 
                    amount: price,
                    interval: each,
                    user_id: user.value?.id,
                    family: isFamily
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const checkoutLink: { url: string } = await response.json();

        if (!checkoutLink?.url) {
            throw new Error("Invalid response format: missing URL");
        }

        window.location.href = checkoutLink.url;

    } catch (error) {
        console.error("Checkout creation failed:", error);
    } finally {
        isLoader.value = false;
    }
};

onMounted(() => {
    scroll_to('main')
})

</script>

<style scoped>

@keyframes bounceArrow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

.arrow {
  display: inline-block;
  animation: bounceArrow 1.2s ease-in-out infinite;
}

</style>