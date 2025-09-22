<template><teleport to="body"><div :class="showLoader ? 'bottom-5' : '-bottom-80'" class="fixed inset-x-0 flex justify-center items-center w-full" style="transition:all .3s ease"><div class="relative overflow-hidden rounded-xl border-l-4 border-yellow-950 bg-yellow-800 h-15 w-[300px] pl-5 flex items-center"><div class="absolute inset-0 bg-yellow-600 loader-fill" :style="{ animationDuration: progressDuration + 'ms' }"></div><span class="w-5 h-5 relative z-10" style="filter:invert(1)"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15H12.01M12 12V9M4.98207 19H19.0179C20.5615 19 21.5233 17.3256 20.7455 15.9923L13.7276 3.96153C12.9558 2.63852 11.0442 2.63852 10.2724 3.96153L3.25452 15.9923C2.47675 17.3256 3.43849 19 4.98207 19Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> </span><span class="text-white ml-3 relative z-10">{{ value || 'text here' }}</span></div></div></teleport></template>
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