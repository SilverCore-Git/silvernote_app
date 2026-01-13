<template>


    <div
        class="
            fixed bottom-22 md:bottom-10 right-6 z-20 gap-4
            flex flex-col justify-center items-center 
        "
    >

        <!-- SilverIA btn -->
        <div class="hidden md:block">
            <button
                class="
                    bg-(--white) hover:bg-(--bg2) border-gray-200
                    hover:text-(--btn) hover:border
                    transition-all duration-300 ease-in-out
                    w-14 h-14 rounded-full
                    flex justify-center items-center
                    text-2xl shadow-lg bounce-hover
                    cursor-pointer
                "
            >
                <i class="bi bi-stars" />
            </button>
        </div>

        <!-- new note btn -->
        <button
            @click="router.push('/edit/new')"
            class="
                transition-all duration-300 ease-in-out
                bg-(--btn) text-(--white)
                w-16 h-16 rounded-2xl
                flex justify-center items-center
                text-5xl shadow-lg cursor-pointer
                hover:rotate-180 hover:bg-(--btn-hover)
            "
        >
            <i class="bi bi-plus" />
        </button>

    </div>

</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';


const router = useRouter();

</script>