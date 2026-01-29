<template>

    <teleport to="body">

        <transition name="fade">
            <backdrop-overlay
                v-if="visible"
                @emit-click="emitClose"
            />
        </transition>

        <transition name="pop">

            <div
                v-if="visible"
                class="fixed inset-0 z-1000 flex items-center justify-center p-4 pointer-events-none"
            >
                <div
                    class="
                        bg-(--bg2) rounded-2xl shadow-2xl
                        border border-(--text)/10 p-6 w-full
                        max-w-sm relative pointer-events-auto
                        overflow-hidden
                    "
                    @click.stop
                >

                    <a
                        class="
                            absolute top-4 right-4 p-2
                            rounded-full text-(--text-little)
                            transition-colors z-100
                        "
                        aria-label="Fermer"
                        @click="emitClose"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </a>

                    <div>
                        <slot></slot>
                    </div>

                </div>

            </div>

        </transition>

    </teleport>

</template>

<script setup lang="ts">

import { onMounted, onBeforeUnmount, watch } from 'vue';
import BackdropOverlay from '../common/BackdropOverlay.vue';

const props = defineProps<{
    visible: boolean;
}>();

const emit = defineEmits(['update:visible']);

const emitClose = () => emit('update:visible', false);

const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.visible) emitClose();
};

watch(() => props.visible, (val) => {
    document.body.style.overflow = val ? 'hidden' : '';
});

onMounted(() => window.addEventListener('keydown', handleEsc));

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEsc);
    document.body.style.overflow = '';
});


</script>

<style scoped>


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


.pop-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.pop-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pop-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}


</style>