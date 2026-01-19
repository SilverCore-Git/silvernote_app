<script setup lang="ts">

import Loader from '@/components/Loader.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

window.location.href = String(route.query.redirectUrl) || '/';

</script>

<template>
    <div class="fixed inset-0 bg-(--bg) z-50">
        <div class="flex justify-center items-center w-screen h-screen">
            <Loader :icon="false" />
        </div>
    </div>
</template>