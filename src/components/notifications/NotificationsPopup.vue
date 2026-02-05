<template>

    <Teleport to="body">

        <div>

            <BackdropOverlay v-if="show" @click="emit('update:show', false)" />

            <transition name="fade-slide">

                <div
                    v-if="show"
                    class="
                        fixed inset-x-4 inset-y-20 z-100
                    "
                >

                    <div 
                        class="
                            bg-(--bg) border border-(--text)/20 
                            shadow-lg rounded-xl p-4 h-full pt-10
                        "
                    >

                        <a
                            class="
                                absolute top-4 right-4 p-2
                                rounded-full text-(--text)
                                transition-colors z-100
                            "
                            aria-label="Fermer"
                            @click="emit('update:show', false)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </a>

                        <Notifications />

                    </div>

                </div>

            </transition>

        </div>

    </Teleport>

</template>

<script setup lang="ts">

import BackdropOverlay from '../common/BackdropOverlay.vue';
import Notifications from './Notifications.vue';

defineProps<{
  show: boolean
}>();

const emit = defineEmits(['update:show']);

</script>