<template>

<header class="flex flex-row pt-4 relative">
    <div class="left-arrow absolute left-4" @click="router.push('/')"></div>
</header>


</template>


<script lang="ts" setup>

    import { useRouter } from 'vue-router';

    const router = useRouter();


</script>