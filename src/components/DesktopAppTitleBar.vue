<template>

    <header
        v-if="isElectron"
        class="
            relative min-h-10 max-h-10 bg-(--bg2)
            flex items-center justify-between z-9999
        "
        style="-webkit-app-region: drag;"
    >

        <div class="absolute inset-x-0 flex justify-center items-center">
            {{ title }}
        </div>

        <div class="flex h-full absolute right-0 inset-y-0" style="-webkit-app-region: no-drag">

            <button 
                @click="minimize"
                class=" w-full h-full text-(--btn) cursor-pointer hover:bg-(--white) px-3 hover:text-(--btn-hover)"
            >
                <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6">
                    <path d="M4 12L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>

            <button 
                @click="maximize"
                class=" w-full h-full text-(--btn) cursor-pointer hover:bg-(--white) px-3 hover:text-(--btn-hover)"
            >
                <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>

            <button 
                @click="close"
                class=" w-full h-full text-(--btn) cursor-pointer hover:bg-(--white) px-3 hover:text-red-500"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"/>
                </svg>
            </button>

        </div>

    </header>

</template>

<script lang="ts" setup>

import isElectron from '@/assets/ts/utils/isElectron'
import { onMounted, onUnmounted, ref } from 'vue';

const title = ref<string>(document.title);
let observer: MutationObserver | null = null;



const minimize = () => {
    (window as any).windowControls.minimize()
}
const maximize = () => {
    (window as any).windowControls.maximize()
}
const close = () => {
    (window as any).windowControls.close()
}


onMounted(() => {
    
    title.value = document.title;

    observer = new MutationObserver(() => {
        title.value = document.title;
    });

    const titleElement = document.querySelector('title');
    if (titleElement) {
        observer.observe(titleElement, { 
            childList: true, 
            characterData: true, 
            subtree: true 
        });
    }

});

onUnmounted(() => {
    if (observer) observer.disconnect();
});


</script>