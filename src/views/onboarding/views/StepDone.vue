<template>

    <div 
        class="
            flex flex-col h-full justify-center items-start 
            text-start relative z-10 animate-in fade-in 
            slide-in-from-bottom-4 duration-1000 p-4 md:p-8
        "
    >
        
        <div class="mb-6 flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <i class="bi bi-check-lg text-2xl"></i>
        </div>

        <h2 class="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-none">
            Tout est <span class="text-transparent bg-clip-text bg-gradient-to-r from-(--btn) to-(--btn-hover)">prêt</span> !
        </h2>

        <p class="text-lg md:text-xl opacity-50 mb-10 max-w-md leading-relaxed font-medium">
            Votre nouvel espace de pensée est configuré. Vos idées n'attendent plus que vous.
        </p>

        <div class="relative group">

            <div class="absolute -inset-1 bg-gradient-to-r from-(--btn) to-(--btn-hover) rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <button 
                @click="handleComplete" 
                :disabled="loading"
                class="group premium relative px-10! py-4! font-bold! overflow-hidden flex items-center gap-3 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
                <template v-if="!loading">
                    <span>Ouvrir Silvernote</span>
                    <i class="bi bi-rocket-takeoff group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
                </template>
                <template v-else>
                    <i class="bi bi-arrow-repeat animate-spin" />
                    <span>Préparation...</span>
                </template>
            </button>

        </div>

        <div class="mt-6 flex items-center gap-2 opacity-30 text-[10px] font-bold uppercase tracking-widest">
            <template v-if="!loading">
                <span>Appuyez sur</span>
                <kbd class="px-2 py-1 bg-(--text)/10 border border-(--text)/20 rounded-md font-sans text-[11px]">Entrée</kbd>
                <span>pour terminer</span>
            </template>
            <span v-else class="animate-pulse">Finalisation de l'espace...</span>
        </div>

    </div>

</template>

<script lang="ts" setup>

import { onMounted, onUnmounted } from 'vue';

const props = defineProps<{ 
  loading: boolean 
}>();

const emit = defineEmits(['complete']);

const handleComplete = () => {
  if (!props.loading) emit('complete');
};

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !props.loading) {
        handleComplete();
    }
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));

</script>

<style scoped>

@keyframes fadeInSlide {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: fadeInSlide 0.6s ease-out forwards;
}

</style>