<template>



    <div 
      :class="active ? 'p-0.5 text-center border-3 border-[#F28C28] cursor-pointer' 
                     : 'p-1 text-center border-1 cursor-pointer'" 
      class="rounded-[15px]"
    >
        <span class="w-[90%]">{{ name }}</span>
    </div>

</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue';

const props = defineProps<{
  name: string,
  tag: string,
  active: boolean
}>();


const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (props.name === 'create_tag' && inputRef.value) {
    inputRef.value.focus();
  }
});

</script>

<style scoped>

input:focus {
  border-color: #F28C28;
  outline: none;
}

button:hover {
  background-color: #f28c28;
}
</style>

