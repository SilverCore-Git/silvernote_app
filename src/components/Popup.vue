<template>
        
    <teleport to="body">
        
        <div
            v-if="visible"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            @click.self="emitClose"
        >
        
            <div
                class="bg-[var(--bg2)] rounded-2xl shadow-xl p-6 m-4 w-full max-w-md text-sm border border-gray-300 dark:border-zinc-700 relative"
            >
                
                <button
                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                    @click="emitClose"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                
                <slot></slot>

            </div>

        </div>

    </teleport>

</template>

<script setup lang="ts">

defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:visible']);

const emitClose = () => {
  emit('update:visible', false);
};

</script>

