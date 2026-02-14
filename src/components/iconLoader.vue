<template>
    <div class="h-full w-full flex justify-center items-center">
        <div class="loader-wrapper">
            <img src="/favicon.svg" class="loader-icon" />
        </div>
    </div>
</template>

<style scoped>

.loader-wrapper {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
}

.loader-icon {
    width: 80px;
    height: 80px;
    animation: flash 2.5s ease-in-out infinite;
    display: block;
}

.loader-wrapper::before {
    content: "";
    position: absolute;
    top: 0;
    left: -150%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to right,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
    transition: 0.8s;
    z-index: 1;
    animation: balayage 4s ease-in-out infinite;
}

@keyframes balayage {
    0% {
        left: -150%;
    }
    33.33% {
        left: 150%;
    }
    100% {
        left: 150%;
    }
}

</style>