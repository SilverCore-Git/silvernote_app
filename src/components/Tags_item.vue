<template>

    <div :id="tag" class="p-1 text-center border-1" style="border-radius: 15px;">
        <span>{{ name }}</span>
    </div>

</template>

<script lang="ts" setup>

defineProps<{
    name: string,
    tag: string
}>()

</script>