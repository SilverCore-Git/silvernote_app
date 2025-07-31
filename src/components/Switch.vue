<template>

    <div @click="emit('active'); value = !value" class="switch">
        <input :value="value" type="checkbox">
        <div class="slider"></div>
    </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';


const props = defineProps<{
    value?: boolean
}>()

const value = ref<boolean>(props.value || false);

const emit = defineEmits([
    'active'
])

</script>