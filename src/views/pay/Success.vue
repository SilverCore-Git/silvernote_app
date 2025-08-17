<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

        <Nav_bar />

    </nav>


    <main v-if="!loader" class="flex flex-col items-center justify-center py-60  mx-auto text-center text-[var(--text)] space-y-8">

        <h1 class="text-5xl md:text-7xl font-extrabold uppercase tracking-wide text-[var(--text-strong)]">
            Bienvenue dans le clan <span class="text-[var(--btn)]">{{ plan }}</span>
        </h1>

        <p class="text-xl md:text-2xl">
            Paiement réussi, Merci pour votre achat,<br />
            Vous venez de souscrire a l'abonement
            <strong class="text-[var(--btn)]">{{ plan }}</strong> !
        </p>

        <p class="text-2xl md:text-3xl font-bold mt-10">Vous pouvez accéder à l'application dès maintenant :</p>

        <a href="https://app.silvernote.fr"><button class="premium">
            Ouvrir SilverNote
        </button></a>

    </main>

    <div v-if="loader" class="flex flex-col items-center justify-center py-100  mx-auto text-center text-[var(--text)] space-y-8">
        <Loader :icon="false" />
    </div>

    <footer class="z-50 w-screen">
        <Footer />
    </footer>

</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import confetti from "canvas-confetti"

import Nav_bar from '../../components/Nav_bar.vue';
import Footer from '../../components/Footer.vue';
import { useUser } from '@clerk/vue';
import Loader from '../../components/Loader.vue';

const route = useRoute();
const { user, isLoaded } = useUser();

const loader = ref<boolean>(true);
const plan = ref<string | null>(null);

onMounted(() => {
    plan.value = route.query.plan?.toString() as string;

    const interval = setInterval(async () => {

        if (isLoaded && loader.value !== false) {

            const response
                    : Promise<{ ok?: boolean, plan: string, error?: boolean, plan_data: any, sub_id: string, customerId: string }> 
                    = await fetch('https://api.silvernote.fr/money/success/checkout', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: route.query.session_id, user_id: user.value?.id })
            }).then(res => res.json());

            if ((await response).ok) {
                await fetch('https://api.silvernote.fr/user/plan/set',
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            userId: user.value?.id, 
                            planId: (await response).plan, 
                            plan_data: (await response).plan_data,
                            customerId: (await response).customerId,
                            sub_id: (await response).sub_id
                        })
                    }
                )
            }

            loader.value = false;

            setTimeout(() => waw(), 500);
            clearInterval(interval);

        }

    }, 1000)
    
});


function waw() {
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 }
  })
}

</script>
