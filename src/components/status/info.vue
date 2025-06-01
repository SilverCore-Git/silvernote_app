<template>

    <div
        role="alert"
        class="bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-700 text-blue-900 dark:text-blue-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-blue-200 dark:hover:bg-blue-800 transform hover:scale-105"
    >
        <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        class="h-5 w-5 flex-shrink-0 mr-2 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        >
        <path
            d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
        ></path>
        </svg>
        <p class="text-xs font-semibold">
            Info - {{ content }}
        </p>
    </div>

</template>

<script lang="ts" setup>

defineProps<{
    content: string;
}>();

</script>