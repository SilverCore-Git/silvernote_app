<template>

    <div v-if="loaded && plan" class="w-full bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300">
        
        <div class="flex items-center justify-between">

            <h2 class="text-2xl font-bold text-yellow-600">
                {{ plan.name }} Plan
            </h2>

            <span class="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full uppercase tracking-wide">
                {{ plan.plan_data.each }}
            </span>

        </div>

        <div class="mt-4 space-y-2 text-gray-700 text-sm">
                
            <div class="flex items-center gap-2">
                
                <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 14v7m0-13V3m6.364 3.636l1.414 1.414M4.222 4.222l1.414 1.414M21 12h-7m-7 0H3m3.636 6.364l-1.414 1.414m13.556-1.414l-1.414 1.414" />
                </svg>

                <p>
                    <strong>Formule:</strong>
                    {{ plan.plan_data.family ? 'Famille 👨‍👩‍👧‍👦' : 'Individuelle 👤' }}
                </p>
                
            </div>

            <div class="text-gray-400 text-xs mt-4 truncate">
                <span><strong>SUBSCRIPTIONS_ID :</strong> {{ plan.plan_data.strip_session_id || "undefined" }}</span><br />
                <span><strong>PLAN_ID :</strong> {{ plan.uuid || "undefined" }}</span>
            </div>

        </div>
    
    </div>

    <div v-if="!loaded" class="w-full bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300">
        
        <div class="flex items-center justify-between">

            <h2 class="text-2xl font-bold text-yellow-600" :class="loading"></h2>

            <span class="text-sm text-yellow-800 px-3 py-1 rounded-full uppercase tracking-wide" :class="loading"></span>

        </div>

        <div class="mt-4 space-y-2 text-gray-700 text-sm">
                
            <div class="flex items-center gap-2">

                <p :class="loading" class="w-50">
                </p>
                
            </div>

            <div class="text-gray-400 text-xs mt-4 truncate">
                <div class="w-150" :class="loading"></div>
            </div>

        </div>
    
    </div>
    

    <div v-if="!plan && loaded" class="w-full bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300">
    
        <h2>Aucun plan trouvé</h2>

    </div>

</template>

<script lang="ts" setup>

import { useUser } from '@clerk/vue';
import { ref } from 'vue';

const { user, isLoaded } = useUser()

const plan = ref();
const loaded = ref<boolean>(false)
const loading = 'animate-pulse bg-gray-300 w-28 h-6 rounded-full';

const interval = setInterval(async () => {

  if (isLoaded) {
    
    try {
    
        const res = await fetch('http://localhost:3000/user/get/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.value?.id }),
        });

        if (!res.ok) {
            plan.value = false;
        } else {
            const data = await res.json();
            plan.value = data?.plan || false;
        }

        loaded.value = true;
        
    } catch (err) {
    
        console.error('Erreur lors de la récupération du plan :', err);
        plan.value = false;
        loaded.value = true;
        clearInterval(interval);
    
    } finally {
        clearInterval(interval);
    }

  }
  
}, 1000);


</script>