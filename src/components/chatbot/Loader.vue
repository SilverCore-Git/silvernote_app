<template>

    <div class="bg-[var(--btn)] w-15 py-3 rounded-2xl flex justify-center items-end gap-1.5">

        <div class="bouncing-circle"></div>
        <div class="bouncing-circle delay-1"></div>
        <div class="bouncing-circle delay-2"></div>

    </div>

</template>

<style scoped>

.bouncing-circle {
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  animation: bounce 0.6s infinite alternate;
}

.delay-1 {
  animation-delay: 0.2s;
}

.delay-2 {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(-5px);
  }
}

</style>
