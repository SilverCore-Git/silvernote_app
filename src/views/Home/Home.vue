
<template>

<!-- div général de la page -->
<div
    class="
        overflow-hidden
        w-screen h-screen
    "
>

    <!-- conteneur alignement x -->
    <div
        class="
            flex flex-row
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
                flex flex-col gap-8 p-8
            "
        >

            <!-- search + tags -->
            <div>
                <SearchAndTag />
            </div>

            <!-- notes -->
            <div>
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