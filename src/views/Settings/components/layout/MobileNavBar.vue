<template>

    <Teleport to="body">

        <div
            class="
                fixed bottom-0 inset-x-0 
                bg-(--bg2) shadow-2xl
                text-4xl py-4 px-8 z-50
                pb-[calc(12px+env(safe-area-inset-bottom))]
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
                    :class="
                        route.params.page == page.path.replace('/', '')
                        || page.path == '/' && !route.params.page 
                            ? 'text-(--btn)'
                            : ''
                    "
                    class="p-1"
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