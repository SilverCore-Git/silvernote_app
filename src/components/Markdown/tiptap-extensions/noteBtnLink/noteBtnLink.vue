<template>

<span>{{ noteId }}</span>

</template>

<script lang="ts" setup>


defineProps<{
    noteId: number
}>();

</script>