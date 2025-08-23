<template><teleport to="body"><div :class="showLoader ? 'right-5' : '-right-80'" class="fixed bottom-6" style="transition:all .3s ease"><div class="relative overflow-hidden rounded-xl border-l-4 border-red-950 bg-red-800 h-15 w-[300px] pl-5 flex items-center"><div class="absolute inset-0 bg-red-600 loader-fill" :style="{ animationDuration: progressDuration + 'ms' }"></div><span class="w-5 h-5 relative z-10" style="filter:invert(1)"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V7C11 6.44772 11.4477 6 12 6Z" fill="#000000"/><path d="M12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16Z" fill="#000000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" fill="#000000"/></svg> </span><span class="text-white ml-3 relative z-10">{{ value || 'text here' }}</span></div></div></teleport></template>
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