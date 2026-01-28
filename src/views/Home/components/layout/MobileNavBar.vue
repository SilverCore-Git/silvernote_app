<template>

    <Teleport to="body">

        <div
            class="
                absolute bottom-0 inset-x-0 
                bg-(--bg2) shadow-2xl
                text-4xl py-4 px-8
                md:hidden
            "
        >

            <div
                class="flex justify-between items-center w-full"
            >

                <a 
                    v-for="(btn, index) in Btns"
                    :key="index" 
                    @click="router.push(btn.href)"
                    :class="route.fullPath == btn.href ? 'text-(--btn)' : ''"
                    class="p-1"
                >
                    <i class="bi" :class="btn.icon" />
                </a>

            </div>

        </div>

    </Teleport>

</template>

<script lang="ts" setup>

import { useRoute, useRouter } from 'vue-router';


const router = useRouter();
const route = useRoute();


const Btns = [
    {
        icon: 'bi-house-fill',
        href: '/'
    },
    {
        icon: 'bi-share-fill',
        href: '/?page=shared'
    },
    {
        icon: 'bi-gear-fill',
        href: '/settings'
    }
]

</script>