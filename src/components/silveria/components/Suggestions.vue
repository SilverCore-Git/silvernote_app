<script setup lang="ts">
import { messages, sendMessage } from '../composables/useMessage';
import { suggestions } from '../composables/useSuggestions';

</script>

<template>

    <div
        v-if="messages.length === 0"
        class="
            h-full flex flex-col 
            items-center justify-center
            text-center opacity-60
        "
    >

        <i class="bi bi-chat-dots text-4xl mb-4" />

        <p class="text-sm mb-6">
            Comment puis-je t'aider aujourd'hui ?
        </p>

        <div class="flex flex-wrap justify-center gap-2 max-w-[80%]">
            <button 
                v-for="sugg in suggestions"
                :key="sugg"
                @click="sendMessage({ text: sugg })"
                class="suggestion-tag"
            >
                {{ sugg }}
            </button>
        </div>

    </div>

</template>

<style scoped>
@import '../assets/silveia.css';
</style>