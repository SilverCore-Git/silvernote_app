
<template>

<!-- div général de la page -->
<div
    class="
        overflow-y-auto fixed
        inset-0 flex
    "
>

    <!-- conteneur alignement x -->
    <div
        class="
            flex flex-row w-full h-full
        "
    >

        <!-- navbar -->
        <nav>

            <NavBar>

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

        </nav>

        <!-- conteneur allignement y -->
        <div
            class="
                flex-1 flex flex-col p-8 gap-8 overflow-hidden
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
import AllNotes from './components/layout/AllNotes.vue';
import NavBar from './components/layout/Navbar.vue';
import SearchAndTag from './components/layout/SearchAndTag.vue';
import { isRotating, reload_list } from './composables/Reload';


</script>

<style scoped>

.rotating {
    animation: rotate 0.6s linear infinite;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

</style>