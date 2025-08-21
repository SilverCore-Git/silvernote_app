<template>

    <div 
        v-if="origin == 'user'" 
        class="bg-[var(--btn)] w-full py-2.5 pl-3 pr-2 rounded-t-2xl rounded-l-2xl"
    >
        <span class="whitespace-pre-wrap break-words text-white">{{ text }}</span>
    </div>

    <div 
        v-if="origin == 'ai'" 
        class="border-1 border-[var(--btn)] w-full py-2.5 pl-3 pr-2 rounded-t-2xl rounded-r-2xl"
    >
        <span class=" whitespace-pre-wrap break-words text-[var(--text)]">{{ text }}</span>
    </div>

    <div 
        v-if="origin == 'error'" 
        class="border-1 border-[var(--btn)] w-full py-2.5 pl-3 pr-2 rounded-t-2xl rounded-r-2xl"
    >
        <span class=" whitespace-pre-wrap break-words text-red-600">{{ text }}</span>
    </div>

</template>

<script lang="ts" setup>

defineProps<{
    origin: "ai" | 'user' | 'error';
    text: string;
}>()

</script>