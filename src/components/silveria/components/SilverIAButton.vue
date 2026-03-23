<script setup lang="ts">

import { useShortcut } from '@/composables/useShrotcut';
import { isOpen, toggleChat } from '../assets/const';

const { tooltipConfig } = useShortcut(
    [ 'shift', 'e' ],
    'Ouvrir SilverIA',
    () => {
        isOpen.value = !isOpen.value;
    }
)

</script>

<template>
    
    <button 
        @click="toggleChat"
        class="
            pointer-events-auto
            bg-(--white) hover:bg-(--bg2) border-(--btn)
            hover:text-(--btn) border hover:ring-2
            transition-all duration-300 ease-in-out
            w-14 h-14 rounded-full
            flex justify-center items-center
            text-2xl shadow-2xl bounce-hover
            cursor-pointer
        "
        v-tooltip="tooltipConfig"
    >

        <i 
            class="bi bi-stars text-(--btn) absolute transition-all" 
            :class="
                isOpen
                    ? 'opacity-0 rotate-90' 
                    : 'opacity-100'
            "
        />
        <i 
            class="bi bi-chevron-down text-gray-500 absolute transition-all" 
            :class="
                isOpen 
                    ? 'opacity-100' 
                    : 'opacity-0 -rotate-90'
            "
        />

    </button>

</template>