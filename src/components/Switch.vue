<template>
  <div @click="toggle" class="switch min-w-12.5">
    <input :checked="modelValue" type="checkbox" />
    <div class="slider"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>
