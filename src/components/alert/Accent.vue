<template><teleport to="body"><div :class="showLoader ? 'right-5' : '-right-80'" class="fixed bottom-6" style="transition:all .3s ease"><div class="relative overflow-hidden rounded-xl border-l-4 border-blue-950 bg-blue-800 h-15 w-[300px] pl-5 flex items-center"><div class="absolute inset-0 bg-blue-600 loader-fill" :style="{ animationDuration: progressDuration + 'ms' }"></div><span class="w-5 h-5 relative z-10" style="filter:invert(1)"><svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><title>information-circle</title><g id="Layer_2" data-name="Layer 2"><g id="invisible_box" data-name="invisible box"><rect width="48" height="48" fill="none"/></g><g id="icons_Q2" data-name="icons Q2"><path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2Zm0,40A18,18,0,1,1,42,24,18.1,18.1,0,0,1,24,42Z"/><path d="M24,20a2,2,0,0,0-2,2V34a2,2,0,0,0,4,0V22A2,2,0,0,0,24,20Z"/><circle cx="24" cy="14" r="2"/></g></g></svg> </span><span class="text-white ml-3 relative z-10">{{ value || 'text here' }}</span></div></div></teleport></template>
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