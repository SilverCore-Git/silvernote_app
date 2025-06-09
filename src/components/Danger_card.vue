<template>

    <div 
        :class="btn ? 'cursor-pointer' : ''" 
        class="bg-[#fff2d0] mr-4 ml-4 text-[#D96E30] p-5 border-[#3B3B3B] border-2 relative" 
        style="border-radius: 15px; font-family: 'Montserrat';"
        @click="handleClick"
    >
        <span class="font-bold text-2xl">{{ title }}</span>
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