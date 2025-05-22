<template>

    <div class="bg-[#fff2d0] mr-4 ml-4 text-[#D96E30] p-5 border-[#3B3B3B] border-2 relative" style="border-radius: 15px;">
        <span class="font-bold text-2xl">{{ title }}</span>
        <p class=" text-xl">{{ content }}</p>
    </div>

</template>

<script setup lang='ts'>

defineProps({
    title: String,
    content: String
})
    
</script>