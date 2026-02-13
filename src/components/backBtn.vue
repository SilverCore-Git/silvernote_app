<template>
  <i 
    class="
      absolute left-0 cursor-pointer 
      bi bi-arrow-left-short z-50 
      text-5xl hover:scale-120
      active:scale-90
       transition-all duration-300
    " 
    :class="white ? 'text-(--white)' : ' text-(--btn)'"
    @click="goBack"
    title="Retour"
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
