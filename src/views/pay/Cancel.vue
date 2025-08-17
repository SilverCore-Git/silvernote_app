<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

        <Nav_bar />

    </nav>


    <main class="flex flex-col items-center justify-center py-70 max-w-4xl mx-auto text-center text-[var(--text)] space-y-8">

        <h1 class="text-5xl md:text-7xl font-extrabold uppercase tracking-wide text-[var(--text-strong)]">
            Paiement annulé
        </h1>

        <p class="text-xl md:text-2xl">
            Souscription annulée.
        </p>

        <button @click="router.push('/')" class="primary">
            Retours a l'accueil
        </button>

    </main>

    <footer class="z-50 w-screen">
        <Footer />
    </footer>

</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Nav_bar from '../../components/Nav_bar.vue';
import Footer from '../../components/Footer.vue';

const route = useRoute();
const router = useRouter();

const plan = ref<'silver' | 'gold' | 'platinium' | 'ultimate' | null>(null);

onMounted(() => {
    plan.value = route.query.plan?.toString() as 'silver' | 'gold' | 'platinium' | 'ultimate';
    
    fetch('https://api.silvernote.fr/money/success/checkout', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: route.query.session_id })
    })
});

</script>
