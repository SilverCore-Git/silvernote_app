<script setup lang="ts">

import { useRoute } from 'vue-router';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useUser } from '@clerk/vue';

// import components
import SilverIAButton from './components/SilverIAButton.vue';
import MessagesContaner from './components/MessagesContaner.vue';
import Suggestion from './components/Suggestions.vue';

// import const and composables
import { 
    isOpen, 
    isMaximised, 
    toggleChat, 
    toggleMaximise,
    isUserInputMaximised,
    chatBody, // ref
    online,
    isLoading,
    toggleUserInputMaximise,
    loaded
} from './assets/const';

import {
    userInput,
    messages,
    sendMessage
} from './composables/useMessage';

import useChat from './composables/useSilveriaAPI/useChat';
import waitFor from '@/assets/ts/utils/waitFor';
import isMobile from '@/assets/ts/utils/isMobile';


const route = useRoute();
const { user, isLoaded } = useUser();
const MessageTextarea = ref<HTMLTextAreaElement | null>(null);

onMounted(async () => {
    await waitFor(() => isLoaded.value, 10000);
    loaded.value = true;
    await useChat.create(user.value);
    waitFor(() => chatBody.value !== undefined, 10000);
})

onBeforeUnmount(async () => {
    await useChat.close(useChat?.chat.value?.uuid || '');
})

watch(() => isOpen.value, async () => {
    await nextTick();
    MessageTextarea.value?.focus();
})


</script>

<template>

    <div
        class="
            fixed right-7
            flex flex-col items-end z-50
            gap-4 pointer-events-none
        "
        :class="
            !route.path.startsWith('/edit') && !route.path.startsWith('/share')
                ? 'bottom-42 md:bottom-30'
                : 'bottom-22 md:bottom-10'
        "
    >
        
        <Transition name="slide-fade">

            <div 
                v-if="isOpen"
                class="
                    pointer-events-auto
                    bg-(--bg) border border-(--text)/10
                    rounded-2xl overflow-hidden z-50
                    flex flex-col transition-all! duration-400
                    ease-in-out origin-bottom-right
                "
                :class="[
                    isMaximised 
                        ? 'fixed inset-0 rounded-none md:absolute md:inset-auto md:right-0 md:bottom-20 md:w-[800px] md:max-w-[90vw] md:max-h-[80vh] md:h-[700px] md:rounded-2xl' 
                        : 'w-[90vw] h-[500px] sm:w-[400px] absolute bottom-20 right-0 ',
                    isMaximised && isMobile ? 'shadow-none' : 'shadow-2xl'
                ]"
            >

                <div
                    class="
                        flex items-center justify-between
                        p-4 border-b border-(--text)/5
                        bg-(--bg2)
                    "
                >

                    <div
                        class="flex items-center gap-3"
                    >

                        <div
                            class="
                                w-8 h-8 rounded-full
                                bg-linear-to-tr from-(--btn)
                                to-(--btn-hover) flex items-center
                                justify-center shadow-lg
                            "
                        >    
                            <i class="bi bi-stars text-white text-sm" />
                        </div>

                        <div>

                            <h3 class="font-bold text-sm">SilverIA</h3>
                            <div class="text-[10px] opacity-50 flex items-center gap-1">
                                <span 
                                    class="w-2 h-2 rounded-full animate-pulse" 
                                    :class="online ? 'bg-green-600' : 'bg-red-600'"
                                />
                                Agent {{ online ? 'en ligne' : 'hors ligne' }}
                            </div>

                        </div>

                    </div>

                    <div class="flex gap-1">

                        <button 
                            @click="toggleMaximise" 
                            class="default" 
                            :title="isMaximised ? 'Réduire' : 'Agrandir'"
                        >
                            <i :class="isMaximised ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen'" />
                        </button>

                        <button 
                            @click="messages = []" 
                            class="default"
                            title="Effacer"
                        >
                            <i class="bi bi-eraser" />
                        </button>

                        <button 
                            @click="toggleChat" 
                            class="default hover:text-red-500 transcition-colors duration-300"
                        >
                            <i class="bi bi-x-lg" />
                        </button>

                    </div>

                </div>

                <div 
                    ref="chatBody"
                    class="
                        flex-1 overflow-y-auto p-4
                        space-y-6 bg-(--bg) scroll-smooth
                    "
                >

                    <Suggestion v-if="isOpen && online && loaded" />

                    <MessagesContaner />

                </div>

                    
                <div 
                    class="p-4 bg-(--bg2) border-t border-(--text)/5 "
                >

                    <div
                        class="
                            relative flex items-end
                            gap-2 bg-(--bg) p-2 h-full
                            rounded-xl border border-(--text)/10
                            transition-all duration-500
                        "
                    >

                        <textarea
                            v-model="userInput"
                            ref="MessageTextarea"
                            @keydown.enter.exact.prevent="sendMessage({ route })"
                            placeholder="Posez votre question..."
                            :rows="
                                isUserInputMaximised === 'yes'
                                    ?   20
                                    :   isMaximised
                                            ? userInput.length > 90*2 // ~ 2 liness
                                                ? userInput.length > 90*3 // ~ 4 lignes
                                                    ? userInput.length > 90*4 // ~ 5 lines
                                                        ? userInput.length > 90*5 // ~ 6 lines
                                                            ? userInput.length > 90*6 // ~ 7 lines
                                                                ? userInput.length > 90*7 // ~ 8 lines
                                                                    ? '7'
                                                                    : '6'
                                                                : '5'
                                                            : '4'
                                                        : '3'
                                                    : '2'
                                                : '1'
                                            : userInput.length > 40*2 // ~ 2 liness
                                                ? userInput.length > 40*3 // ~ 4 lignes
                                                    ? userInput.length > 40*4 // ~ 5 lines
                                                        ? '4'
                                                        : '3'
                                                    : '2'
                                                : '1'
                            "
                            class="
                                w-full bg-transparent border-none
                                text-sm resize-none
                                max-h-60 py-2 px-2 outline-none
                                auto-expand-input
                                transition-all duration-500
                            "
                        />

                        <div 
                            class="
                                flex items-center justify-between
                                flex-col shrink-0 h-full
                            "
                        >

                            <button 
                                v-if="isUserInputMaximised == 'can' || isUserInputMaximised == 'yes'"
                                @click="toggleUserInputMaximise" 
                                class="default" 
                                :title="isUserInputMaximised == 'yes' ? 'Réduire' : 'Agrandir'"
                            >
                                <i :class="isUserInputMaximised == 'yes' ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen'" />
                            </button>

                            <button 
                                @click="sendMessage({ route })"
                                :disabled="!userInput.trim() || isLoading"
                                class="
                                    h-9 w-9 rounded-lg
                                     transition-all mb-0.5
                                "
                                :class="
                                    userInput.trim() 
                                        ? 'bg-(--btn) text-white shadow-lg scale-105' 
                                        : 'bg-(--text)/10 text-(--text)/20'
                                "
                            >
                                <i class="bi bi-send-fill text-sm" />
                            </button>

                        </div>

                    </div>

                </div>

            </div>
            
        </Transition>

        <SilverIAButton />

    </div>

</template>

<style scoped>
@import './assets/silveia.css';
</style>