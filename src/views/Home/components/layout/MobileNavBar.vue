<template>

    <Teleport to="body">

        <div
            class="
                absolute bottom-0 inset-x-0 
                bg-(--bg2) shadow-2xl
                text-2xl py-3 px-10
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
                    :class="route.fullPath == btn.href ? 'bg-(--btn) ring-(--btn-hover) ring-2' : ''"
                    class="p-1"
                    :title="btn.name"
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
        name: 'Accueil',
        href: '/'
    },
    {
        icon: 'bi-people-fill',
        name: 'Partage',
        href: '/?page=shared'
    },
    {
        icon: 'bi-gear-fill',
        name: 'Paramètres',
        href: '/settings'
    }
]

</script>