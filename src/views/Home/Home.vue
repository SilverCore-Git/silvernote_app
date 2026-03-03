
<template>

<!-- div général de la page -->
<div
    class="
        overflow-y-auto fixed
        inset-0 flex flex-col
        h-full w-full
        bg-(--bg2)
    "
>

    <DesktopAppTitleBar class="w-full h-full" />

    <!-- conteneur alignement x -->
    <div
        class="
            flex flex-row 
            h-full w-full
        "
    >

        <!-- navbar -->
        <nav>

            <NavBar class="hidden md:block">

                <a 
                    class="p-1.5"
                    v-tooltip.bottom="tooltipConfig"
                >
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
                bg-(--bg)
            "
            :class="isElectron ? 'rounded-tl-xl border-t border-l border-(--text-little)/20' : ''"
        >

            <!-- search + tags -->
            <div>
                <SearchAndTag />
            </div>

            <!-- notes -->
            <AllNotes class="flex-1" />

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
import isElectron from '@/assets/ts/utils/isElectron';
import { useShortcut } from '@/composables/useShrotcut';

const { tooltipConfig } = useShortcut(
    'r',
    'Recharger',
    () => {
        reload_list('cloud');
    }
)

</script>
