<script setup lang="ts">

import { api_url } from '@/assets/ts/backend_link';
import App2048Popup from '@/components/2048/App2048Popup.vue';
import getToken from '@/composables/useToken';
import { onMounted, ref } from 'vue';


interface UserStats {
    id: string;
    username?: string;
    best_score: number;
    total_score: number;
    max_tile: number;
    lastPlayed: string;
    partiesCount: number;
}

interface Data {
    best_score: UserStats[];
    total_score: UserStats[];
    max_tile: UserStats[];
}


const showGame = ref<boolean>(false);
const userId = localStorage.getItem('user_id') || '';
const data = ref<Data | undefined>(undefined);
const isLoading = ref(true);
const activeTab = ref<'best_score' | 'total_score' | 'max_tile'>('best_score');


const tabs = [
    { key: 'best_score', label: 'Meilleur Score', icon: 'bi-trophy-fill' },
    { key: 'total_score', label: 'Score Cumulé', icon: 'bi-graph-up' },
    { key: 'max_tile', label: 'Tuile Max', icon: 'bi-dice-6-fill' },
] as const;


const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit'
    });
};

const formatId = async (id: string): Promise<string> => { 
    const response = await fetch(`${api_url}/api/user/by/id/${id}`);
    const json = await response.json();
    return json.username || 'Utilisateur inconnu'; 
};

const getValue = (user: UserStats) => {2
    switch (activeTab.value) {
        case 'best_score': return user.best_score.toLocaleString();
        case 'total_score': return user.total_score.toLocaleString();
        case 'max_tile': return user.max_tile;
    }
};

onMounted(async () => {

    try {

        isLoading.value = true;

        const res = await fetch(`${api_url}/api/2048/leaderboard`, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
            }
        });
        const json = await res.json();

        data.value = json.leaderboard;

        const enrichUsers = async (users: any[]) => {
            await Promise.all(
                users.map(async (user) => {
                    user.username = await formatId(user.id);
                })
            );
        };

        if (data.value) {
            await Promise.all([
                enrichUsers(data.value.best_score),
                enrichUsers(data.value.total_score),
                enrichUsers(data.value.max_tile),
            ]);
        }

    } catch (err) {
        console.error("Failed to fetch leaderboard data:", err);
    } finally {
        isLoading.value = false;
    }

});


</script>

<template>

    <div class="min-h-full w-full p-8 bg-(--bg) transition-colors duration-300">
        
        <header class="mb-8 max-w-2xl mx-auto text-center md:text-left">

            <h1 class="font-bold text-3xl mb-2 tracking-tight text-(--text-strong)">
                Jeu 2048
            </h1>

            <p class="opacity-60 text-sm text-(--text-little)">
                Découvrez les meilleurs scores du jeu 2048 intégré à Silvernote et comparez vos performances.
            </p>

        </header>

        <div class="max-w-2xl mx-auto">

            <button class="primary w-full" @click="showGame = true">Ouvrir le jeu 2048</button>

            <hr class="my-8 border-(--text)/20" />

            <h2 class=" text-2xl font-bold ">Mes Scores</h2>

            <div class="grid grid-cols-3 gap-3 my-4">

                <div class="flex items-center gap-3 bg-(--bg2) p-4 rounded-xl border border-(--text)/10 w-full md:w-auto">
                    <i class="bi bi-trophy-fill text-2xl text-yellow-400" />
                    <div>
                        <p class="text-sm text-(--text-little)">Meilleur Score</p>
                        <p class="font-bold text-lg text-(--btn)">{{ data?.best_score.find(u => u.id === userId)?.best_score.toLocaleString() || 'N/A' }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 bg-(--bg2) p-4 rounded-xl border border-(--text)/10 w-full md:w-auto">
                    <i class="bi bi-graph-up text-2xl text-green-400" />
                    <div>
                        <p class="text-sm text-(--text-little)">Score Cumulé</p>
                        <p class="font-bold text-lg text-(--btn)">{{ data?.total_score.find(u => u.id === userId)?.total_score.toLocaleString() || 'N/A' }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 bg-(--bg2) p-4 rounded-xl border border-(--text)/10 w-full md:w-auto">
                    <i class="bi bi-dice-6-fill text-2xl text-blue-400" />
                    <div>
                        <p class="text-sm text-(--text-little)">Tuile Max</p>
                        <p class="font-bold text-lg text-(--btn)">{{ data?.max_tile.find(u => u.id === userId)?.max_tile || 'N/A' }}</p>  
                    </div>
                </div>
            </div>

            <hr class="my-8 border-(--text)/20" />

            <h2 class=" text-2xl font-bold mb-4">Classement</h2>
            
            <div class="flex p-1 bg-(--bg2) rounded-xl mb-6 overflow-x-auto">

                <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    @click="activeTab = tab.key"
                    class="
                        flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all
                        whitespace-nowrap flex items-center justify-center gap-2
                    "
                    :class="activeTab === tab.key 
                        ? 'bg-(--bg) text-(--btn) shadow-sm ring-1 ring-(--text)/5' 
                        : 'text-(--text-little) hover:text-(--text-strong)'"
                >
                    <i class="bi" :class="tab.icon" />
                    <span>{{ tab.label }}</span>
                </button>

            </div>

            <div v-if="isLoading" class="flex justify-center py-12 opacity-50">
                <span class="animate-pulse">Chargement des scores...</span>
            </div>

            <div v-else-if="data && data[activeTab]" class="space-y-3">
                
                <div 
                    v-for="(user, index) in data[activeTab]" 
                    :key="user.id"
                    class="
                        group flex items-center p-4 rounded-xl border border-(--text)/10
                        bg-(--bg) hover:bg-(--bg) transition-colors relative overflow-hidden
                    "
                >
                    <div class="w-10 text-xl font-bold shrink-0 text-center">
                        <span v-if="index === 0">🥇</span>
                        <span v-else-if="index === 1">🥈</span>
                        <span v-else-if="index === 2">🥉</span>
                        <span v-else class="opacity-40 text-sm">#{{ index + 1 }}</span>
                    </div>

                    <div class="grow flex flex-col pl-2">

                        <span 
                            class="font-bold text-(--text-strong) text-sm md:text-base"
                        >
                            {{ user.username }}
                        </span>

                        <span class="text-[10px] md:text-xs text-(--text-little) opacity-70">
                            {{ user.partiesCount }} parties • Dernier jeu le {{ formatDate(user.lastPlayed) }}
                        </span>

                    </div>

                    <div class="text-right pl-4">

                        <span 
                            class="block font-mono font-bold text-lg md:text-xl text-(--btn)"
                            v-text="getValue(user)"    
                        />

                        <span class="text-[10px] uppercase tracking-wider opacity-50 block">
                            {{ activeTab === 'max_tile' ? 'Tuile' : 'Points' }}
                        </span>

                    </div>

                    <div class="absolute inset-0 border-2 border-(--btn) opacity-0 group-hover:opacity-10 rounded-xl pointer-events-none transition-opacity" />
               
                </div>

                <div v-if="data[activeTab].length === 0" class="text-center py-12 text-(--text-little) italic">
                    Aucun score enregistré pour le moment. Soyez le premier !
                </div>

            </div>

        </div>

    </div>

    <App2048Popup 
        v-model:show="showGame" 
    />

</template>