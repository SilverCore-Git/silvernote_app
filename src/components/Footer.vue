<template>
    
    <div class="bg-gray-800 text-white py-10 rounded-t-xl">

        <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">

            <div class="mb-4 md:mb-0">
                <h3 class="text-2xl font-bold mb-2">SilverNote</h3>
                <p class="text-gray-400">&copy; {{ year }} SilverNote. Tous droits réservés.</p>
            </div>

            <div class="flex flex-row items-start md:justify-between md:w-[60%] w-full space-x-8">

                <div class="flex flex-col">
                <span>Nous sommes aussi</span>
                    <a href="https://www.silvercore.fr" target="_blank" class="text-gray-400 hover:text-white">Silvercore</a>
                    <a href="https://www.silvertransfert.fr" target="_blank" class="text-gray-400 hover:text-white">Silvertransfert</a>
                </div>

                <div class="flex flex-col">
                    <span>Contact</span>
                    <a href="https://discord.gg/ftFhQTJsQ5" target="_blank" class="text-gray-400 hover:text-white">Discord silvercore</a>
                    <a href="https://discord.gg/mKs3uMTJWM" target="_blank" class="text-gray-400 hover:text-white">Discord support</a>
                </div>

                <div class="flex flex-col">
                    <span>Legale</span>
                    <a @click="router.push('/politique-de-confidentialite')" class="text-gray-400 hover:text-white">Confidentialité</a>
                    <a @click="router.push('/mentions-legales')" class="text-gray-400 hover:text-white">Mentions legales</a>
                    <a @click="router.push('/conditions-general-utilisation')" class="text-gray-400 hover:text-white">Conditions général d'utilisation (CGU)</a>
                </div>

            </div>

        </div>

    </div>

</template>

<script lang="ts" setup>

import { useRouter } from 'vue-router';

const router = useRouter();

const year: number = new Date().getFullYear();


</script>