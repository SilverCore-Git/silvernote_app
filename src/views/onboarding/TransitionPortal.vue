<template>

    <Transition name="portal">

        <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center bg-(--bg) animate-reveal">

            <div class="absolute inset-0 bg-radial-gradient from-(--btn)/20 to-transparent animate-pulse" />
            
            <div class="flex flex-col items-center space-y-8">
                <IconLoader />
                <h2 class="text-xl font-bold tracking-widest uppercase opacity-50">Préparation de votre espace</h2>
            </div>

        </div>
        
    </Transition>

</template>

<script setup>

import IconLoader from '@/components/iconLoader.vue';

defineProps({ show: Boolean });

</script>

<style scoped>

.portal-leave-active {
  transition: all 1s cubic-bezier(0.7, 0, 0.3, 1);
}

.portal-leave-to {
  opacity: 0;
  filter: blur(20px);
  transform: scale(1.2);
}

.animate-reveal {
  animation: reveal .5s ease-out forwards;
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>