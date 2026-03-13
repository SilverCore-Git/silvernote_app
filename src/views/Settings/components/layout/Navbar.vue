<template>

    <div
        class="
            h-full p-4 
            min-w-55
            xl:min-w-70
            bg-(--bg2)
            border-r border-(--text-little)/20
        "
    >

       <ul class="w-full flex flex-col gap-2 mt-4">

            <a
                @click="router.push('/')"
                class="
                    px-4 py-2 rounded-xl cursor-pointer
                    flex gap-2 justify-start items-center
                    transition-all duration-300
                    border-transparent
                    hover:border-(--btn) border
                    hover:-translate-x-2
                "
            >
                <i class="bi bi-arrow-left-short text-4xl text-(--btn) " />
                Accueil
            </a>

            <hr class=" my-6 text-gray-400" />

            <a 
                v-for="page in pages"
                @click="router.push('/settings' + page.path)"
                class="li px-4 py-2 rounded-xl cursor-pointer group"
                :class="[
                    page.name == '' ? 'hidden' : '',
                    route.params.page == page.path.replace('/', '')
                    || page.path == '/' && !route.params.page
                        ? 'bg-(--btn)' 
                        : ''
                ]"
            >
                <i 
                    :class="
                        page.icon,
                        route.params.page == page.path.replace('/', '') 
                        || page.path == '/' && !route.params.page
                            ? 'text-white group-hover:text-(--text)' 
                            : 'text-(--btn)'
                    "
                    class="bi text-xl  transition-all duration-300"
                />
                <span
                    :class="[
                        page.name == '' ? 'hidden' : '',
                        route.params.page == page.path.replace('/', '')
                        || page.path == '/' && !route.params.page
                            ? 'text-white group-hover:text-(--text)' 
                            : ''
                    ]"
                    class=" transition-all duration-300"
                >{{ page.name }}</span>
            </a>
            
            <hr class=" my-6 text-gray-400" />

            <SignOutButton><a
                class="li px-4 py-2 rounded-xl cursor-pointer"
            >
                <i
                    class="text-red-600 bi bi-box-arrow-right text-xl"
                />
                <span class="text-red-600">Se déconnecter</span>
            </a></SignOutButton>

        </ul>

    </div>

</template>

<script lang="ts" setup>
    
import { useRoute, useRouter } from 'vue-router';
import { SignOutButton } from '@clerk/vue';
import { pages } from './navbar';

const router = useRouter();
const route = useRoute();

</script>

<style scoped>

.li {
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
    transition: all 0.3s;
    :where(& > :not(:last-child)) {
        --tw-space-x-reverse: 0;
        margin-inline-start: calc(calc(var(--spacing) * 2) /* 0.5rem = 8px */ * var(--tw-space-x-reverse));
        margin-inline-end: calc(calc(var(--spacing) * 2) /* 0.5rem = 8px */ * calc(1 - var(--tw-space-x-reverse)));
    };
}

.li:not(.nohover2):hover {
    padding-left: 2em;
}


</style>