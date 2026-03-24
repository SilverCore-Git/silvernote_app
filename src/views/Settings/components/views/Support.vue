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

</script>

<template>

    <div class="min-h-full max-w-5xl mx-auto w-full p-8 transition-colors duration-300">
        
        <header class="mb-8">
            <h1 class="font-bold text-3xl mb-2 tracking-tight">
                Support & Assistance
            </h1>
            <p class="opacity-60 text-sm">
                Un problème ou une suggestion ? Notre équipe est là pour vous aider.
            </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
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

    </div>

</template>
