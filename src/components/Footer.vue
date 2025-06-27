<template>
    
    <div class="bg-gray-800 text-white py-10 rounded-t-xl">

        <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">

            <div class="mb-4 md:mb-0">
                <h3 class="text-2xl font-bold mb-2">SilverNote</h3>
                <p class="text-gray-400">&copy; 2025 SilverNote. Tous droits réservés.</p>
            </div>

            <div class="flex space-x-6">
                <a @click="router.push('/politique-de-confidentialite')" class="text-gray-400 hover:text-white">Confidentialité</a>
                <a @click="" class="text-gray-400 hover:text-white">Conditions d'utilisation</a>
                <a @click="" class="text-gray-400 hover:text-white">Contact</a>
            </div>

        </div>

    </div>

</template>

<script lang="ts" setup>

import { useRouter } from 'vue-router';

const router = useRouter();

</script>