<template>
  <div 
    class="left-arrow absolute left-0 cursor-pointer z-50" 
    :class="white ? 'white' : ''"
    @click="goBack"
  ></div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  white?: boolean;
  href?: string;
}>();

const goBack = () => {
  if (props.href) return router.push(props.href);
  return router.push({ name: 'Home' });
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'Home' });
  }
};
</script>
