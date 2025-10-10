<template>
  <div class="flex flex-col justify-center items-center min-h-screen">
    <div class="_spinner">
      <div class="spiner spiner1"></div>
      <div class="spiner spiner2"></div>
      <div class="spiner spiner3"></div>
      <div class="spiner spiner4"></div>
    </div>
  </div>
</template>

<style scoped>

._spinner {
  position: relative;
  width: 90px;
  height: 90px;
}

.spiner {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 4px solid transparent;
}

.spiner1 {
  width: 40px;
  height: 40px;
  border-right-color: var(--btn);
  animation: spinner-rotate 0.6s linear infinite;
}

.spiner2 {
  width: 60px;
  height: 60px;
  border-right-color: var(--btn);
  opacity: 0.9;
  animation: spinner-rotate 1s linear infinite;
  animation-delay: 0.3s;
}

.spiner3 {
  width: 77px;
  height: 77px;
  border: 6px solid var(--btn);
  border-right-color: transparent;
  border-top-color: transparent;
  opacity: 0.6;
  animation: spinner-reverse 1.5s linear infinite;
}

.spiner4 {
  border: 6px solid var(--btn);
  animation: spinner-flash 3s ease-in-out infinite;
}

@keyframes spinner-rotate {
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes spinner-reverse {
  100% {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

@keyframes spinner-flash {
  0% {
    width: 70px;
    height: 70px;
    opacity: 0;
  }
  5% {
    opacity: 0;
  }
  15% {
    width: 97px;
    height: 97px;
    opacity: 1;
  }
  30% {
    width: 70px;
    height: 70px;
    opacity: 0.1;
  }
  100% {
    width: 70px;
    height: 70px;
    opacity: 0;
  }
}

</style>
