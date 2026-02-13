<template>

    <Teleport to="body">

        <div
            class="
                absolute bottom-0 inset-x-0 
                bg-(--bg2) shadow-2xl
                text-2xl py-3 px-10
                lg:hidden
            "
        >

            <div
                class="flex justify-between items-center w-full"
            >

                <a 
                    v-for="(page, index) in pages"
                    :key="index" 
                    @click="router.push('/settings' + page.path)"
                    :class="[
                        route.params.page == page.path.replace('/', '')
                        || page.path == '/' && !route.params.page 
                            ? 'bg-(--btn) ring-(--btn-hover) ring-2'
                            : ''
                    ]"
                    class="p-1"
                    :title="page.name"
                >
                    <i class="bi" :class="page.icon" />
                </a>

            </div>

        </div>

    </Teleport>

</template>

<script lang="ts" setup>

import { useRoute, useRouter } from 'vue-router';
import { pages } from './navbar';

const router = useRouter();
const route = useRoute();

</script>