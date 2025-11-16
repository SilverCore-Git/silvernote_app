<template>
  <div @click="toggle" class="switch min-w-12.5">
    <input :checked="value" type="checkbox" />
    <div class="slider"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: boolean
}>();

const emit = defineEmits<{
  (e: "update", value: boolean): void
}>();

const toggle = () => {
  emit("update", !props.value); 
}
</script>
