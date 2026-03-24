<script setup lang="ts">

import useSettingsItem from '@/assets/ts/settings/useSettingsItem';
import { onMounted, ref } from 'vue';
import { api_url } from '@/assets/ts/backend_link';
import useToken from '@/composables/useToken';

const { Item: aiFunc } = useSettingsItem('aiFunc', true);
const { Item: snoteWrapped } = useSettingsItem('snoteWrapped', true);

const fingerPrint = ref<string>('');
const showFingerprint = ref<boolean>(false);


onMounted(async () => {
    fingerPrint.value = await fetch(`${api_url}/api/db/get/scrypto/fingerprint`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${await useToken() || ''}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(res => res.json()).then(data => data.fingerprint || '');
});

</script>

<template>

    <div class="min-h-full max-w-5xl mx-auto w-full p-8 transition-colors duration-300 space-y-10">
        
        <header>

            <div class="flex items-center gap-3 mb-2">
                <h1 class="font-bold text-3xl tracking-tight">Sécurité & Confidentialité</h1>
            </div>
            <p class="opacity-60 text-sm">
                Gérez la protection de vos données et les paramètres d'intelligence artificielle.
            </p>
        </header>

        <section>
            
            <div 
                class="
                    p-6 rounded-xl bg-(--bg2) 
                    border border-(--white)/10
                    hover:border hover:border-(--btn) 
                    transition-all duration-200! 
                    cursor-pointer
                "
                @click="aiFunc = !aiFunc" 
                :class="!aiFunc ? 'opacity-75' : ''"
            >

                <div class="flex items-center justify-between mb-6">

                    <div>
                        <p class="font-medium">Fonctionnalités intelligentes</p>
                        <p class="text-xs opacity-50 max-w-md">Autorise l'analyse sémantique pour suggérer des icônes et optimiser vos recherches.</p>
                    </div>
                    
                    <button 
                        :class="aiFunc ? 'bg-(--btn)' : 'bg-gray-600'"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
                    >
                        <span :class="aiFunc ? 'translate-x-2' : '-translate-x-2'" class="h-4 w-4 rounded-full bg-white transition-transform" />
                    </button>

                </div>

                <div 
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all" 
                    :class="!aiFunc ? 'pointer-events-none opacity-20' : ''"
                >

                    <label class="flex items-center gap-3 p-3 rounded-lg bg-(--bg)/50 border border-(--white)/5 pointer-events-none">
                        <input type="checkbox" :checked="aiFunc" class="accent-(--btn) w-4 h-4">
                        <span class="text-sm">Suggestions d'icônes magiques</span>
                    </label>

                    <label class="flex items-center gap-3 p-3 rounded-lg bg-(--bg)/50 border border-(--white)/5 pointer-events-none">
                        <input type="checkbox" :checked="aiFunc" class="accent-(--btn) w-4 h-4">
                        <span class="text-sm">SilverIA chatbot</span>
                    </label>

                </div>

            </div>

        </section>

        <section>
            
            <div 
                class="
                    p-6 rounded-xl bg-(--bg2) 
                    border border-(--white)/10
                    hover:border hover:border-(--btn) 
                    transition-all duration-200! 
                    cursor-pointer
                "
                @click="snoteWrapped = !snoteWrapped" 
                :class="!snoteWrapped ? 'opacity-75' : ''"
            >

                <div class="flex items-center justify-between ">

                    <div>
                        <p class="font-medium">Rétrospective du mois : Snote Wrapped</p>
                        <p class="text-xs opacity-50 max-w-md">Autorise l'analyse de vous actions pour vos présenter une retrospective mensuel.</p>
                    </div>
                    
                    <button
                        :class="snoteWrapped ? 'bg-(--btn)' : 'bg-gray-600'"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
                    >
                        <span :class="snoteWrapped ? 'translate-x-2' : '-translate-x-2'" class="h-4 w-4 rounded-full bg-white transition-transform" />
                    </button>

                </div>

            </div>

        </section>

        <section 
            class="mb-8 p-6 rounded-xl bg-(--bg2) border border-(--white)/10 overflow-hidden relative"
        >

            <i class="bi bi-shield-lock-fill absolute -right-4 -top-4 text-4xl opacity-5 text-(--btn)" />

            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

                <div>
                    <h2 class="font-semibold text-lg mb-1 flex items-center gap-2">
                        <i class="bi bi-shield-check text-(--btn)" /> Chiffrement des données
                    </h2>
                    <p class="text-xs opacity-60 max-w-md">
                        Vos notes sont protégées par un chiffrement <strong>AES-256-GCM</strong>. 
                        Chaque utilisateur possède une clé d'isolation unique dérivée de notre clé maître.
                    </p>
                </div>

                <div class="flex flex-col items-end">
                    
                    <div class="text-[10px] opacity-40 uppercase tracking-widest mb-1 font-bold">
                        Code de sécurité (Fingerprint)
                    </div>
                    
                    <div 
                        class="flex items-center gap-2 bg-(--bg) px-4 py-2 rounded-lg border border-(--white)/5 group relative"
                        title="Ceci est une empreinte unique de votre clé de sécurité."
                        v-if="fingerPrint && fingerPrint != ''"
                    >
                        
                        <code 
                            v-if="showFingerprint" 
                            class="text-(--btn) font-mono font-bold tracking-wider text-sm cursor-help"
                        >
                            {{ fingerPrint }}
                        </code>

                        <div 
                            v-else 
                            class="
                                h-5 w-full bg-(--white)/5 animate-pulse
                                rounded text-(--text)/80 font-mono font-bold
                                tracking-wider text-sm cursor-pointer
                            "
                            @click="showFingerprint = true"
                        >
                            <span class="text-transparent">A-AAAA-AAAA</span>
                            voir le code
                            <span class="text-transparent">A-AAAA-AAAA</span>
                        </div>
                        
                        <i 
                            class="bi bi-info-circle text-xs opacity-30 group-hover:opacity-100 transition-opacity" 
                        />

                    </div>

                    <div 
                        class="flex items-center gap-2 bg-(--bg) px-4 py-2 rounded-lg border border-(--white)/5 group relative"
                        v-else
                    >

                        <div 
                            class="
                                h-5 w-80 bg-(--white)/5 animate-pulse
                                rounded text-(--text)/80 font-mono font-bold
                                tracking-wider text-sm cursor-pointer
                            "
                            @click="showFingerprint = true"
                        />
                        
                        <i 
                            class="bi bi-info-circle text-xs opacity-30 group-hover:opacity-100 transition-opacity" 
                        />

                    </div>

                </div>
            
            </div>

        </section>

    </div>

</template>