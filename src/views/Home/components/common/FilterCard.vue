<template>

    <div 
        class="
            bg-(--white) border rounded-2xl 
            flex justify-center items-center gap-1 flex-row
            px-3 py-1.5 cursor-pointer
        "
        :class="active ? 'border-(--btn)' : 'border-gray-200'"
    >

        <div
            :style="{ backgroundColor: color }"
            class="
                rounded-full w-3 h-3
            "
        />

        <span
            class=" uppercase text-xs"
        >
            {{ name }}
        </span>

    </div>

</template>

<script lang="ts" setup>

defineProps<{
    color: string;
    name: string;
    active: boolean;
}>();

</script>