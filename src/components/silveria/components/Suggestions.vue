<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { messages, sendMessage } from '../composables/useMessage';
import { getThreeSuggestions } from '../composables/useSuggestions';

const currentSuggestions = ref<string[]>([]);

onMounted(() => {
    currentSuggestions.value = getThreeSuggestions();
});
</script>

<template>

    <div
        v-if="messages.length === 0"
        class="
            h-full flex flex-col 
            items-center justify-center
            text-center
        "
    >

        <div class="opacity-60 contents-wrapper">
            <i class="bi bi-chat-dots text-4xl mb-4 block" />
            <p class="text-sm mb-8">
                Comment puis-je t'aider aujourd'hui ?
            </p>
        </div>

        <TransitionGroup 
            tag="div" 
            name="staggered-fade"
            class="flex flex-col gap-3 w-full max-w-sm px-4"
            appear
        >

            <button 
                v-for="(sugg, index) in currentSuggestions"
                :key="sugg"
                @click="sendMessage({ text: sugg })"
                class="suggestion-card"
                :style="{ '--delay': index * 0.1 + 's' }"
            >

                <span class="text-xs text-left">{{ sugg }}</span>
                <i class="bi bi-arrow-right-short text-lg opacity-50" />

            </button>

        </TransitionGroup>

    </div>

</template>

<style scoped>

@import '../assets/silveia.css';

.suggestion-card {
    
    display: flex;
    align-items: center;
    justify-content: space-between;


    border: 1px solid var(--white);
    border-radius: var(--radius-xl, 0.75rem);

    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: var(--text-sm, 0.875rem);
    font-weight: 500;

    transition: all 0.300s ease;
    cursor: pointer;
    box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));

    animation: slideUp 0.5s ease forwards;
    animation-delay: var(--delay);
    opacity: 0;
    outline: none;
}

.suggestion-card:hover {
    border-color: var(--btn);
    background-color: var(--white);
}

.suggestion-card:active {
    transform: scale(0.95);
}

.suggestion-card:hover i {
    opacity: 1;
    transform: translateX(0.25rem);
    transition: all 0.3s ease;
    color: var(--btn);
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

</style>