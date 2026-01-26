
<template>

<!-- div général de la page -->
<div
    class="
        overflow-y-auto fixed
        inset-0 flex flex-col
        h-full w-full
    "
>

    <DesktopAppTitleBar />

    <!-- conteneur alignement x -->
    <div
        class="
            flex flex-row w-full h-full
        "
    >

        <!-- navbar -->
        <nav>

            <NavBar class="hidden md:block">

                <a class="p-1.5" v-tooltip.bottom="'Recharger'">
                    <div
                        class="bi bi-arrow-clockwise text-(--btn) text-2xl 
                                w-7 h-7 flex justify-center items-center
                            " 
                        :class="[
                            { rotating: isRotating }
                        ]"
                        @click="reload_list('cloud')"
                    ></div>
                </a>

            </NavBar>

            <!-- md:hidden gérer par le composant -->
            <MobileNavBar />

        </nav>

        <!-- conteneur allignement y -->
        <div
            class="
                flex-1 flex flex-col p-4 gap-4 md:p-8 md:gap-8 overflow-hidden
            "
        >

            <!-- search + tags -->
            <div>
                <SearchAndTag />
            </div>

            <!-- notes -->
            <div class="flex-1 overflow-y-auto">
                <AllNotes />
            </div>

        </div>

    </div>

</div>

</template>


<script lang="ts" setup>

import DesktopAppTitleBar from '@/components/DesktopAppTitleBar.vue';
import AllNotes from './components/layout/AllNotes.vue';
import MobileNavBar from './components/layout/MobileNavBar.vue';
import NavBar from './components/layout/Navbar.vue';
import SearchAndTag from './components/layout/SearchAndTag.vue';
import { isRotating, reload_list } from './composables/Reload';

</script>
