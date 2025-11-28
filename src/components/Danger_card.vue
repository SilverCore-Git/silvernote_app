<template>

    <div 
        v-if="!hidden"
        :class="btn ? 'cursor-pointer' : ''" 
        class="bg-[#fff2d0] text-[var(--btn)] p-3
              border-2 border-[var(--text)]  relative" 
        style="border-radius: 15px; font-family: 'Montserrat';"
        @click="handleClick"
    >
        <i @click.stop="hidden = true" class="bi bi-x absolute top-1 right-1 text-4xl cursor-pointer" />
        <h1 class="font-bold text-xl md:text-xl">{{ title }}</h1>
        <p class="text-md md:text-md">{{ content }}</p>
    </div>

</template>

<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue';


const props = withDefaults(defineProps<{
  title?: string,
  content?: string,
  href?: string,
  btn?: boolean
}>(), {
  href: '',
  btn: false
});

const hidden = ref<boolean>(false);

const handleClick = (): void => {
  if (props.btn && props.href) {
    window.open(props.href, '_blank');
  }
};

watch(() => hidden.value, (newVal) => {
  localStorage.setItem('hiddenNews', JSON.stringify(newVal))
})

onMounted(() => {
  hidden.value = localStorage.getItem('hiddenNews') == 'true' ? true : false;
})

</script>