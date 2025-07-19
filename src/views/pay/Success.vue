<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

        <Nav_bar />

    </nav>


    <main class="flex flex-col items-center justify-center py-60 max-w-4xl mx-auto text-center text-[var(--text)] space-y-8">

        <h1 class="text-5xl md:text-7xl font-extrabold uppercase tracking-wide text-[var(--text-strong)]">
            Paiement réussi !
        </h1>

        <p class="text-lg md:text-xl">
            Merci pour votre achat,<br />
            <strong class="text-[var(--accent)]">{{ user || 'utilisateur.trice inconu.e' }}</strong> vient de souscrire au plan
            <strong class="text-[var(--accent)]">{{ ['silver', 'gold', 'platinium', 'ultimate'].includes(plan as 'silver' | 'gold' | 'platinium' | 'ultimate') ? plan : 'plan inconu' }}</strong>.
        </p>

        <p class="text-base md:text-lg">Vous pouvez accéder à l'application dès maintenant :</p>

        <a href="https://app.silvernote.fr"><button class="second">
            Ouvrir SilverNote
        </button></a>

    </main>

    <footer class="z-50 w-screen">
        <Footer />
    </footer>

</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import Nav_bar from '../../components/Nav_bar.vue';
import Footer from '../../components/Footer.vue';

const route = useRoute();

const plan = ref<'silver' | 'gold' | 'platinium' | 'ultimate' | null>(null);
const user = ref<string | null>(null);

onMounted(() => {
    plan.value = route.query.plan?.toString() as 'silver' | 'gold' | 'platinium' | 'ultimate';
    user.value = route.query.user?.toString() || null;
});

</script>
