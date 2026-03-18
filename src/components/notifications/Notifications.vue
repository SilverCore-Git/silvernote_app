<template>

        <div class="flex flex-col max-h-2/3">
            
            <hr class="my-6 text-gray-400 -mx-4 opacity-50" />
            
            <div class="flex items-center justify-between mb-2">

                <span class="text-xs text-(--text-little) uppercase font-bold tracking-wider">
                    Notifications
                </span>

                <span 
                    v-if="news && news.length > 0" 
                    class="text-[10px] bg-(--btn) px-1.5 rounded-full"
                >
                    {{ news.length }}
                </span>

            </div>

            <div class="flex flex-col gap-4 overflow-y-auto pr-2 py-2 custom-scrollbar">
                
                <div
                    v-if="!news" 
                    class="text-sm text-(--text) italic p-2 animate-pulse"
                >
                    Chargement des news...
                </div>

                <div v-else-if="news.length === 0" class="text-sm text-(--text-little) italic p-2">
                    Aucune notification pour le moment.
                </div>

                <NotifCard 
                    v-else
                    v-for="(n, index) in news"
                    @click="markRead(n.id)" 
                    :key="'all-news-' + index"
                    :n="n"
                    :read="n.readBy.includes(userId)"
                />

            </div>

        </div>

</template>


<script lang="ts" setup>

import { api_url } from '@/assets/ts/backend_link';
import NotifCard from './NotifCard.vue';
import { notifications as news } from './notifications';
import useToken from '@/composables/useToken';


const userId = localStorage.getItem('user_id') || '';


const markRead = async (id: string) => {
    try {
        const res = await fetch(`${api_url}/api/notifications/mark-read/${id}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await useToken()}`
            }
        });
        if (res.ok) {
            const n = news.value?.find(n => n.id === id);
            if (n) n.readBy.push(userId);
        }
    } catch (e) {
        console.error(e);
    }
}

</script>

<style scoped>

.news-card :deep(p) {
    margin: 0;
    line-height: 1.4;
}

.news-card :deep(a) {
    color: var(--btn);
    text-decoration: underline;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--btn);
    border-radius: 10px;
    opacity: 0.3;
}

.prose-tight :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
}

</style>