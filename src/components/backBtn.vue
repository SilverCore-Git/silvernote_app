<template>
  <i 
    class="
      absolute left-0 cursor-pointer z-50 
      bi bi-arrow-left-short 
      text-5xl hover:text-6xl
       transition-all duration-300
    " 
    :class="white ? 'text-(--white)' : ' text-(--btn)'"
    @click="goBack"
  />
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  white?: boolean;
  href?: string;
}>();

const goBack = () => {
  
  const navigate = () => {
    if (props.href) return router.push(props.href);
    return router.push({ name: 'Home' });
  };

  if (!document.startViewTransition) {
    return navigate();
  }

  document.startViewTransition(() => {
    navigate();
  });
  
};
</script>
