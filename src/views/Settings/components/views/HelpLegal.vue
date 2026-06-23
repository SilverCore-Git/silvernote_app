<script setup lang="ts">

import { ref } from 'vue';

const supportEmail = "support@silvercore.fr";
const discordInvite = "https://taap.it/silvercore.discord.support";
const copied = ref<boolean>(false);

const copyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
};

const openDiscord = () => {
    window.open(discordInvite)
}

const legalLinks = [
    { 
        title: "Conditions Générales d'Utilisation", 
        description: "Les règles à respecter lors de l'utilisation de SilverNote.", 
        url: "https://www.silvernote.fr/terms-of-use", 
        icon: "bi-file-earmark-text"
    },
    { 
        title: "Politique de Confidentialité", 
        description: "Comment nous protégeons et gérons vos données personnelles.", 
        url: "https://www.silvernote.fr/privacy", 
        icon: "bi-shield-lock"
    },
    { 
        title: "Mentions Légales", 
        description: "Informations obligatoires sur l'éditeur de SilverNote.", 
        url: "https://www.silvernote.fr/legal-notices", 
        icon: "bi-bank"
    },
];

</script>

<template>

    <div class="min-h-full max-w-5xl mx-auto w-full p-8 transition-colors duration-300">
        
        <header class="mb-8">
            <h1 class="font-bold text-3xl mb-2 tracking-tight">
                Aide et Juridique
            </h1>
            <p class="opacity-60 text-sm">
                Support technique et documents juridiques.
            </p>
        </header>

        <!-- Support Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            
            <section class="flex flex-col p-6 rounded-2xl bg-(--bg2) border border-(--white)/10 transition-all hover:border-indigo-500/50 group">

                <div class="mb-4 flex items-center justify-between">
                    <div class="w-15 h-15 flex justify-center items-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <i class="bi bi-discord text-3xl" />
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-widest opacity-40">Communauté</span>
                </div>
                
                <h2 class="text-xl font-bold mb-2 text-(--text)">Rejoindre le Discord</h2>
                <p class="text-sm opacity-60 mb-8 grow">
                    Obtenez une aide en temps réel, discutez avec d'autres utilisateurs et suivez les dernières annonces.
                </p>

                <button @click="openDiscord" class="default-primary gap-2 ">
                    Rejoindre le serveur
                    <i class="bi bi-box-arrow-up-right text-xs" />
                </button>

            </section>

            <section class="flex flex-col p-6 rounded-2xl bg-(--bg2) border border-(--white)/10 transition-all hover:border-(--btn)/50">

                <div class="mb-4 flex items-center justify-between">
                    <div class="w-15 h-15 flex justify-center items-center rounded-xl bg-(--btn)/10 text-(--btn)">
                        <i class="bi bi-envelope-at-fill text-3xl" />
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-widest opacity-40">Contact Direct</span>
                </div>
                
                <h2 class="text-xl font-bold mb-2 text-(--text)">Envoyer un Ticket</h2>
                <p class="text-sm opacity-60 mb-8 grow">
                    Pour les questions relatives à votre compte ou vos données, envoyez-nous un email directement.
                </p>

                <div class="flex gap-2  w-full">

                    <button class="default-primary min-w-8/10">
                        <a 
                            :href="`mailto:${supportEmail}`" 
                            class="w-full bg-transparent! hover:bg-transparent!"
                        >
                            Écrire un email
                        </a>
                    </button>

                    <button @click="copyEmail" class="default min-w-2/10" title="Copier l'adresse">
                        <i class="bi" :class="copied ? 'bi-check2 text-green-500' : 'bi-copy'" />
                    </button>

                </div>

            </section>

        </div>

        <!-- Legal Section -->
        <div class="space-y-4">

            <a 
                v-for="link in legalLinks" 
                :key="link.title"
                :href="link.url"
                target="_blank"
                class="
                    group flex items-center justify-between p-6 rounded-xl
                    bg-(--bg2) border border-(--white)/10 hover:border-(--btn)/50 
                    transition-all active:scale-[0.98]
                "
            >

                <div class="flex items-center gap-5">

                    <i 
                        class="
                            text-2xl bg-(--bg) p-3 bi
                            rounded-lg group-hover:scale-110 
                            transition-transform shadow-sm
                        "
                        :class="link.icon"
                    />

                    <div>
                        <h2 class="font-semibold text-lg group-hover:text-(--btn) transition-colors">
                            {{ link.title }}
                        </h2>
                        <p class="text-sm opacity-50">{{ link.description }}</p>
                    </div>
                    
                </div>

                <div class="text-(--btn) opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M7 7h10v10"/><path d="M7 17L17 7"/>
                    </svg>
                </div>

            </a>

        </div>

        <footer class="mt-12 pt-6 border-t border-(--white)/5 text-center">
            <p class="text-xs opacity-40 ">
                Silvernote &copy; {{ new Date().getFullYear() }} — Tous droits réservés.
            </p>
        </footer>

    </div>

</template>
