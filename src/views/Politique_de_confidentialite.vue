<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

        <Nav_bar />

    </nav>

    <header class="mt-30 w-screen text-center">

        <h1 class="uppercase text-9xl font-extrabold">politique de confidentialité</h1>

        <span class="w-screen flex justify-center items-center text-[var(--btn)] font-bold">
            Dernière mise à jour : 18 juillet 2025
        </span>

    </header>

    <main class="px-10 py-20 max-w-4xl mx-auto text-left text-lg space-y-8 text-[var(--text)]">

        <section>
            <h2 class="text-3xl font-bold mb-4">1. Introduction</h2>
            <p>
                Chez SilverCore, nous accordons une grande importance à la confidentialité de vos données, il en est donc de même pour silvernote. 
                Cette politique de confidentialité explique quelles données nous collectons, comment nous les utilisons, et les choix qui s’offrent à vous.
            </p>
        </section>

        <section>
            <h2 class="text-3xl font-bold mb-4">2. Données collectées</h2>
            <p>
                Lorsque vous utilisez Silvernote, nous pouvons collecter les informations suivantes :
            </p>
            <ul class="list-disc ml-6">
                <li>Informations d'authantification (nom, adresse e-mail, etc.)</li>
                <li>Informations techniques (adresse IP, user agent, etc.)</li>
            </ul>
        </section>

        <section>
            <h2 class="text-3xl font-bold mb-4">3. Utilisation des données</h2>
            <p>
                Vos données sont utilisées pour :
            </p>
            <ul class="list-disc ml-6">
                <li>Fournir et améliorer notre service</li>
                <li>Assurer la sécurité de la plateforme</li>
            </ul>
        </section>

        <section>
            <h2 class="text-3xl font-bold mb-4">4. Partage des données</h2>
            <p>
                Nous ne vendons, donnons ou pretons jamais vos données.
            </p>
        </section>

        <section>
            <h2 class="text-3xl font-bold mb-4">5. Sécurité des données</h2>
            <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout accès, perte ou divulgation non autorisés.
            </p>
        </section>

        <section>
            <h2 class="text-3xl font-bold mb-4">6. Vos droits</h2>
            <p>
                Conformément aux lois en vigueur, vous disposez de droits concernant vos données personnelles : accès, rectification, suppression, opposition, et portabilité. Vous pouvez exercer ces droits en nous contactant à l’adresse suivante : privacy@silvernote.app
            </p>
        </section>

        <section>
            <h2 class="text-3xl font-bold mb-4">7. Cookies</h2>
            <p>
                Silvernote utilise des cookies pour améliorer votre navigation, analyser le trafic et personnaliser l’expérience. Vous pouvez modifier vos préférences via les paramètres de votre navigateur.
            </p>
        </section>

        <section>
            <h2 class="text-3xl font-bold mb-4">8. Modifications</h2>
            <p>
                Nous pouvons mettre à jour cette politique de confidentialité à tout moment. La date de dernière mise à jour est indiquée ci-dessous.
            </p>
            <p class="italic mt-2">Dernière mise à jour : 27 juin 2025</p>
        </section>

    </main>

    <footer class="z-50 w-screen">
        <Footer />
    </footer>

</template>

<script lang="ts" setup>
import Nav_bar from '../components/Nav_bar.vue';
import Footer from '../components/Footer.vue';
</script>
