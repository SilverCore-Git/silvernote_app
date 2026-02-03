<script setup lang="ts">

import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const isChecked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

</script>

<template>

    <div
        class="inline-flex items-center cursor-pointer"
        @click="isChecked = !isChecked"
    >

        <input 
            type="checkbox" 
            :id="$.uid.toString()" 
            class="hidden" 
            v-model="isChecked"
        />

        <label
            class="
                relative w-5 h-5 
                border-2 border-(--text)/30 rounded-md 
                flex items-center justify-center 
                cursor-pointer select-none 
                transition-all duration-200
                hover:border-(--text)/50 mr-3
            "
            :class="
                isChecked 
                    ? 'bg-(--btn) border-(--btn) shadow-lg shadow-indigo-500/20'
                    : 'bg-transparent'
            "
        >
            <i
                class="
                    bi bi-check-lg text-lg
                    transition-all duration-200 scale-50
                "
                :class="isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
            />

        </label>

        <slot />

    </div>

</template>

<style scoped>
label:active {
  transform: scale(0.9);
}
</style>