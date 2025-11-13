<template>
  <div class="scroll-wrapper" ref="scrollWrapper">
    <div class="scroll-content" ref="scrollContent">
        <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const scrollWrapper = ref<HTMLElement | null>(null);
const scrollContent = ref<HTMLElement | null>(null);

onMounted(() => {
    if (!scrollWrapper.value || !scrollContent.value) return;

    const updateHeight = () => {
      scrollWrapper.value!.style.height = scrollContent.value!.scrollHeight + 'px';
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    let current = 0;
    let target = 0;
    const ease = 0.2;

    const animate = () => {
      target = window.scrollY;
      current += (target - current) * ease;

      scrollContent.value!.style.transform = `translateY(${-current}px)`;

      requestAnimationFrame(animate);
    };

    animate();
});
</script>

<style scoped>
body {
  margin: 0;
  overflow-x: hidden;
}

.scroll-wrapper {
  position: relative;
  width: 100%;
}

.scroll-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  will-change: transform;
}
</style>
