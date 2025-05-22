<template>

    <div class="bg-[#FFF8F0] mr-4 ml-4 text-[#3B3B3B] p-3 border-[#3B3B3B] border-2 relative" style="border-radius: 15px;">
        <span class="font-bold text-xl">{{ title }}</span>
        <p class=" text-lg">{{ content }}</p>
        <label class="absolute right-2 bottom-1">{{ date }}</label>
    </div>

</template>

<script setup lang='ts'>

defineProps({
    title: String,
    content: String,
    date: String
})
    
</script>