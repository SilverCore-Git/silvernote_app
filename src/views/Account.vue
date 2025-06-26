<template>

<header class="flex flex-row relative" style="padding-top: calc(1rem + env(safe-area-inset-top)/2);">
    <div class="left-arrow absolute left-0" :class="hitbox ? 'bg-red-600' : ''" @click="router.push('/')"></div>
</header>


</template>


<script lang="ts" setup>

    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router';

    import { hitbox as if_hitbox } from '../assets/ts/settings';

    let hitbox: boolean;
    onMounted(async () => { hitbox = await if_hitbox() })

    const router = useRouter();


</script>