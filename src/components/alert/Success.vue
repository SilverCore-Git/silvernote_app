<template><teleport to="body"><div :class="showLoader ? 'right-5' : '-right-80'" class="fixed bottom-6" style="transition:all .3s ease"><div class="relative overflow-hidden rounded-xl border-l-4 border-green-950 bg-green-800 h-15 w-[300px] pl-5 flex items-center"><div class="absolute inset-0 bg-green-600 loader-fill" :style="{ animationDuration: progressDuration + 'ms' }"></div><span class="w-5 h-5 relative z-10" style="filter:invert(1)"><svg fill="#000000" viewBox="0 0 32 32"><path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14 6.28 14 14-6.28 14.032-14 14.032zM22.386 10.146l-9.388 9.446-4.228-4.227c-0.39-0.39-1.024-0.39-1.415 0s-0.391 1.023 0 1.414l4.95 4.95c0.39 0.39 1.024 0.39 1.415 0 0.045-0.045 0.084-0.094 0.119-0.145l9.962-10.024c0.39-0.39 0.39-1.024 0-1.415s-1.024-0.39-1.415 0z"></path></svg> </span><span class="text-white ml-3 relative z-10">{{ value || 'text here' }}</span></div></div></teleport></template>
<script setup lang="ts">

import { ref, onMounted } from 'vue'

const props = defineProps<{
    value: string;
    duration?: number;
}>()

const progressDuration = ref<number>(props.duration || 5000);
const showLoader = ref<boolean>(false);

onMounted(() => {

    setTimeout(() => {
        showLoader.value = true;
    }, 100)

    setTimeout(() => {
        showLoader.value = false;
    }, progressDuration.value)
    
});

</script>
<style scoped>
.loader-fill{animation-fill-mode:forwards;animation-name:fillLoader;animation-timing-function:linear;transform:scaleX(0);transform-origin:left}@keyframes fillLoader{to{transform:scaleX(1)}}
</style>