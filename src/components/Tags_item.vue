<template>
    <div v-if="name === 'create_tag'" class="p-1 text-center w-full border-2 bg-white/80 border-[#F28C28] rounded-[15px] shadow-lg">
        <input
            ref="inputRef"
            type="text"
            class="outline-none pl-1 w-full"
            placeholder="Mon tag"
        />
    </div>

    <div v-else-if="name === 'create_tag_btn'" class="p-1 text-center w-full border-2 bg-white/80 text-[#F28C28] font-bold cursor-pointer rounded-[15px] shadow-md">
        <span>Créer mon tag</span>
    </div>

    <div v-else :id="active ? `${tag}-active` : tag" :class="active ? 'p-0.5 text-center border-3 border-[#F28C28] cursor-pointer' : 'p-1 text-center border-1 cursor-pointer'" class="rounded-[15px]">
        <span>{{ name }}</span>
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
