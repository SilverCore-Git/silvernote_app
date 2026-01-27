<template>
    <div class="h-full w-full flex justify-center items-center">
        <img src="/favicon.svg" class="loader-icon" />
    </div>
</template>

<style scoped>

.loader-icon {
    width: 80px;
    height: 80px;
    animation: flash 2.5s ease-in-out infinite;
}

@keyframes flash {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
}

</style>