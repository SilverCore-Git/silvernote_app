<template>

    <div
        class="
            h-full bg-(--bg2) shadow-2xl
            p-4 min-w-65 max-w-75 relative max-h-screen
        "
    >

        <ul class="w-full">
            
            <li class="flex-col">

                <div
                    @click="showGame = !showGame"
                    class="flex flex-row gap-2 items-center justify-center"
                >

                    <img src="/favicon.svg" class="w-8 rounded-md" />

                    <div class="flex flex-col items-start">
                        <span class="text-base font-bold">Silvernote</span>
                        <span class="text(--text-little) text-[10px] -mt-1">
                            version {{ version }}
                        </span>
                    </div>

                </div>

                <span 
                    v-if="dev" 
                    class="text-sm text-(--btn)" 
                    style="letter-spacing: 0.2px;"
                >
                    Development mode
                </span>

            </li>

            <Transition name="fade-slide">
                <div
                    v-if="selectedNote !== '' && isMobile"
                    class="
                            flex flex-row justify-between items-center rounded-2xl
                            w-full px-4 text-3xl absolute bg-(--bg2) z-35"
                >
                    <Navbar_note_settings
                        @close="closeNoteSettings"
                        :note-uuid="selectedNote"
                    />
                </div>
            </Transition>

            <div
                class="
                        my-2
                        flex flex-row justify-between items-center
                        w-full px-4 z-30 max-w-50 mx-auto
                    "
            >

                <a class="p-1.5" v-tooltip.bottom="'Paramètres'">
                    <div
                        class="
                                bi bi-gear-fill text-(--btn) text-2xl 
                                w-7 h-7 flex justify-center items-center
                        "
                        @click="router.push('/settings')"
                    ></div>
                </a>

                <slot></slot>

                <a class="p-1.5 flex items-center justify-center ">
                    <UserButton
                        :appearance="{
                            ...clerkAppearanceSettings,
                            elements: {
                                userButtonAvatarBox: {
                                    width: '24px',
                                    height: '24px'
                                }
                            }
                        }" 
                    />
                </a>

            </div>

            <div class="flex flex-col gap-2">

                <hr class="mt-3 mb-4 text-gray-400 -mx-4" />

                <span class="text-xs text-(--text-little) uppercase font-semibold">
                    Onglets
                </span>

                <li 
                    class="li"
                    @click="setPage('all')"
                    :class="
                        route.query.page !== 'shared' 
                            ? 'bg-(--btn) text-white hover:text-(--btn)'
                            : ''"
                >
                    <i 
                        :class="route.query.page !== 'shared' ? '' : 'text-(--btn)'"
                        class="bi bi-journal-text text-xl"
                    />
                    <span>Toutes les notes</span>
                </li>

                <li 
                    class="li"
                    @click="setPage('shared')"
                    :class="
                        route.query.page == 'shared' 
                            ? 'bg-(--btn) text-white hover:text-(--btn)'
                            : ''"
                >
                    <i 
                        :class="route.query.page == 'shared' ? '' : 'text-(--btn)'"
                        class="bi bi-people-fill text-xl"
                    />
                    <span>Notes partagées</span>
                </li>

            </div>

        </ul>

        <!-- news -->
        <div class="flex flex-col max-h-2/3">
            
            <hr class="mt-6 mb-4 text-gray-400 -mx-4 opacity-50" />
            
            <div class="flex items-center justify-between mb-2">

                <span class="text-xs text-(--text-little) uppercase font-bold tracking-wider">
                    Notifications
                </span>

                <span 
                    v-if="news" 
                    class="text-[10px] bg-(--btn) px-1.5 rounded-full"
                >
                    {{ todayNews.length }}
                </span>

            </div>

            <div class="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                
                <div v-if="!news" class="text-sm text-(--text-little) italic p-2">
                    Chargement des news...
                </div>

                <div v-else-if="news.length === 0" class="text-sm text-(--text-little) italic p-2">
                    Aucune notification pour le moment.
                </div>

                <div 
                    v-if="!viewAllNews"
                    v-for="(n, index) in todayNews" 
                    :key="'today-news-' + index" 
                    class="
                        news-card border-l-2 border-(--btn) transition-colors
                        bg-(--white)/50 p-3 rounded-r-lg hover:bg-(--white)/80
                    "
                >

                    <div class="flex justify-between items-start mb-1">

                        <span class="font-bold text-sm leading-tight">
                            {{ n.title }}
                        </span>

                        <span v-if="n.date" class="text-[9px] opacity-60">
                            {{ new Date(n.date).toLocaleDateString() }}
                        </span>

                    </div>
                    
                    <div 
                        class="text-xs text-(--text-little prose-tight" 
                        v-html="md.render(n.content)"
                    />

                </div>

                <div 
                    v-else
                    v-for="(n, index) in news" 
                    :key="'all-news-' + index" 
                    class="
                        news-card border-l-2 border-(--btn) transition-colors
                        bg-(--white)/50 p-3 rounded-r-lg hover:bg-(--white)/80
                    "
                >

                    <div class="flex justify-between items-start mb-1">

                        <span class="font-bold text-sm leading-tight">
                            {{ n.title }}
                        </span>

                        <span v-if="n.date" class="text-[9px] opacity-60">
                            {{ new Date(n.date).toLocaleDateString() }}
                        </span>

                    </div>
                    
                    <div 
                        class="text-xs text-(--text-little prose-tight" 
                        v-html="md.render(n.content)"
                    />

                </div>

                <button
                    v-if="news && news.length > todayNews.length"
                    @click="viewAllNews = !viewAllNews"
                    class="
                        w-full h-full text-sm
                        text-(--btn) mt-2 default
                    "
                >
                    {{ viewAllNews ? 'Voir moins' : 'Voir toutes les notifications' }}
                </button>

            </div>

        </div>

        <!-- <ul
            class="
                absolute bottom-4 inset-x-4 gap-2 flex flex-col
            "
        >

  
            <li class="flex justify-start items-center flex-row w-full gap-3">

                <UserAvatar />

                <div class="flex flex-col">
                    <span class="text-md">{{ user?.fullName }}</span>
                    <span class="text-xs">Free</span>
                </div>

            </li>

            <li class=" w-full">

                <button
                    class="second w-full"
                >
                    Devenir premium
                </button>

            </li>


        </ul> -->

        <App2048Popup v-model:show="showGame" />

    </div>

</template>


<script lang="ts" setup>

import { useRoute, useRouter } from 'vue-router';
import { version, dev } from '../../../../../package.json';
import { computed, onMounted, ref, watch } from 'vue';
import isMobile from '@/assets/ts/utils/isMobile';
import { UserButton } from '@clerk/vue';
import { clerkAppearanceSettings } from '@/assets/ts/theme';
import App2048Popup from '@/components/2048/App2048Popup.vue';
import { api_url } from '@/assets/ts/backend_link';
import MarkdownIt from 'markdown-it';
 
const router = useRouter();
const route = useRoute();
const selectedNote = ref<string>('');
const showGame = ref<boolean>(false);
const md = new MarkdownIt({ html: false, linkify: true });
const viewAllNews = ref<boolean>(false);
const news = ref<any[] | undefined>(undefined);
const todayNews = computed(() => {

    if (!news.value) return [];
    
    const today = new Date().toLocaleDateString();
    
    return news.value.filter(n => {
        if (!n.date) return false; 
        return new Date(n.date).toLocaleDateString() === today;
    });

});

const setPage = (a: 'shared' | 'all'): void => {
    router.push({
        query: {
            ...route.query,
            page: a
        }
    });
}

watch(() => route.query.selectedNote, () => {
    if (!route.query.selectedNote) return selectedNote.value = '';
    selectedNote.value = String(route.query.selectedNote);
})

const closeNoteSettings = () => {
    router.push({
        query: {
            ...route.query,
            selectedNote: undefined
        }
    });
}

onMounted(async () => {
    news.value = await (await fetch(`${api_url}/api/notifications`)).json();
})

</script>

<style scoped>

.li {
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
    transition: all 0.3s;
    :where(& > :not(:last-child)) {
        --tw-space-x-reverse: 0;
        margin-inline-start: calc(calc(var(--spacing) * 2) /* 0.5rem = 8px */ * var(--tw-space-x-reverse));
        margin-inline-end: calc(calc(var(--spacing) * 2) /* 0.5rem = 8px */ * calc(1 - var(--tw-space-x-reverse)));
    };
}

.li:not(.nohover2):hover {
    padding-left: 2rem;
}

ul li {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: .5rem;
  padding-left: .8rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

ul hr {
    opacity: 50%;
}

ul li:not(.nohover):hover {
  background-color: rgba(131, 131, 131, 0.15);
}


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