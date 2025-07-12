<template>

    <div 
        :class="btn ? 'cursor-pointer' : ''" 
        class="bg-[#fff2d0] text-[#D96E30] p-5 border-[var(--text)] border-2 relative" 
        style="border-radius: 15px; font-family: 'Montserrat';"
        @click="handleClick"
    >
        <h1 class="font-bold text-2xl">{{ title }}</h1>
        <p class="text-lg">{{ content }}</p>
    </div>

</template>

<script setup lang='ts'>

const props = withDefaults(defineProps<{
  title?: string,
  content?: string,
  href?: string,
  btn?: boolean
}>(), {
  href: '',
  btn: false
});

const handleClick = (): void => {
  if (props.btn && props.href) {
    window.open(props.href, '_blank');
  }
};

    
</script>