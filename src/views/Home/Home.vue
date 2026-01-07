
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
                        class="reload-svg
                                w-6
                                h-6
                            " 
                        :class="[
                            { rotating: isRotating }
                        ]"
                        @click="reload_list()"
                    ></div>
                </a>

            </NavBar>
        </nav>

        <!-- conteneur allignement y -->
        <div
            class="
                flex flex-col
            "
        >

            <!-- search + tags -->
            <div>

            </div>

            <!-- notes -->
            <div>

            </div>

        </div>

    </div>

</div>

</template>


<script lang="ts" setup>
import NavBar from './NavBar.vue';




</script>