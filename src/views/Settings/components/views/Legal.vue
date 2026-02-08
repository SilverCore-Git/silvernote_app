<script setup lang="ts">

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

    <div class="min-h-full max-w-5xl mx-auto w-full p-8 bg-(--bg) transition-colors duration-300">
        
        <header class="mb-8">
            <h1 class="font-bold text-3xl mb-2 tracking-tight">
                Juridique
            </h1>
            <p class="opacity-60 text-sm">
                Consultez les documents officiels et les engagements de Silvernote.
            </p>
        </header>

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