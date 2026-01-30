<template>

    <div 
        class="
            fixed inset-0 z-90
            backdrop-blur-sm
            bg-black/40
        "
        @click="emit('emitClick')"
    />

</template>

<script lang="ts" setup>

const emit = defineEmits([
    "emitClick",
])

</script>