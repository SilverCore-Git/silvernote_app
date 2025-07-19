<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

        <Nav_bar />

    </nav>

    <header class="mt-30 w-screen text-center">

        <h1 class="uppercase text-9xl font-extrabold">mentions legales</h1>

        <span class="w-screen flex justify-center items-center text-[var(--btn)] font-bold">
            Dernière mise à jour : 18 juillet 2025
        </span>

    </header>


    <main class="px-10 py-20 max-w-4xl mx-auto text-left text-lg space-y-8 text-[var(--text)]">

    </main>

    <footer class="z-50 w-screen">
        <Footer />
    </footer>

</template>

<script lang="ts" setup>
import Nav_bar from '../components/Nav_bar.vue';
import Footer from '../components/Footer.vue';
</script>
