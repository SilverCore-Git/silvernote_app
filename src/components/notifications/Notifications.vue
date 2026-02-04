<template>

        <div class="flex flex-col max-h-2/3">
            
            <hr class="my-6 text-gray-400 -mx-4 opacity-50" />
            
            <div class="flex items-center justify-between mb-2">

                <span class="text-xs text-(--text-little) uppercase font-bold tracking-wider">
                    Notifications
                </span>

                <span 
                    v-if="
                        news 
                        && news.length > 0 
                        && todayNews.filter(n => !n.readBy.includes(userId) || n.readBy == undefined).length > 0" 
                    class="text-[10px] bg-(--btn) px-1.5 rounded-full"
                >
                    {{ todayNews.filter(n => !n.readBy.includes(userId) || n.readBy == undefined).length }}
                </span>

            </div>

            <div class="flex flex-col gap-4 overflow-y-auto pr-2 pt-2 custom-scrollbar">
                
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
                    v-if="!viewAllNews"
                    v-for="(n, index) in todayNews"
                    @click="markRead(n.id)"
                    :key="'today-news-' + index"
                    :n="n"
                    :read="n.readBy.includes(userId)"
                    :todayNews="todayNews" 
                />

                <NotifCard 
                    v-else
                    v-for="(n, index) in news"
                    @click="markRead(n.id)" 
                    :key="'all-news-' + index"
                    :n="n"
                    :read="n.readBy.includes(userId)"
                    :todayNews="todayNews"
                />

                <button
                    v-if="news && news.length > todayNews.length"
                    @click="viewAllNews = !viewAllNews"
                    class="
                       min-h-10 text-(--btn) mt-2 default
                    "
                >
                    {{ viewAllNews ? 'Voir moins' : 'Voir toutes les notifications' }}
                </button>

            </div>

        </div>

</template>


<script lang="ts" setup>

import { ref } from 'vue';
import { api_url } from '@/assets/ts/backend_link';
import NotifCard from './NotifCard.vue';
import { notifications as news, todayNotifications as todayNews } from './notifications';
import useToken from '@/composables/useToken';


const userId = localStorage.getItem('user_id') || '';
const viewAllNews = ref<boolean>(false);


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