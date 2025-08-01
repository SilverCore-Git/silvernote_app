<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

        <Nav_bar />

    </nav>

    <header class="mt-30 w-screen text-center">

        <h1 class="uppercase text-9xl font-extrabold">mon compte</h1>

    </header>


    <section class="px-10 py-20 flex items-center flex-col mx-auto text-lg space-y-8 text-[var(--text)]">

        <div>
            <h2 class="uppercase text-4xl font-extrabold mb-2">Mon profile</h2>
            <UserProfile />
        </div>

    </section>

    <section class="px-10 py-20 flex items-center flex-col mx-auto text-lg space-y-8 text-[var(--text)]">

        <div class="max-w-[55rem] w-full">
            <h2 class="uppercase text-4xl font-extrabold mb-2">Mon abonnement</h2>
            <div class="w-full max-w-[55rem] px-0 mx-auto">
                <Subscription />
            </div>
        </div>

    </section>

    <footer class="z-50 w-screen">
        <Footer />
    </footer>

</template>

<script lang="ts" setup>
import Nav_bar from '../../components/Nav_bar.vue';
import Footer from '../../components/Footer.vue';
import { UserProfile } from '@clerk/vue';
import Subscription from '../../components/Subscription.vue';
</script>
