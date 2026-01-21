<template>

    <div class="flex justify-center items-center gap-4">

        <div
            class="
                flex justify-between items-center flex-row 
                border rounded-2xl bg-(--white)
                py-3 px-4 w-full gap-2.5
                transition-all duration-300 ease-in-out
            "
        >

            <div class="flex justify-center items-center gap-2">
                <a class="p-1">
                    <i class=" bi bi-x " />
                </a>
                <span>{{ selectedNotes.length }}</span>
            </div>

            <div
                class="
                    flex justify-center items-center
                    gap-4 mr-1
                "
            >

                <a class="p-1">
                    <i 
                        class="bi"
                        :class="'bi-pin-fill'"   
                    />
                </a>


                <a class="p-1">
                    <i 
                        class="bi bi-share-fill"
                    />
                </a>

                <a class="p-1">
                    <i 
                        class="bi"
                        :class="'bi-tag-fill'"   
                    />
                </a>
                

                <a class="p-1">
                    <i 
                        class="bi"
                        :class="'bi-trash-fill'"   
                    />
                </a>
                

            </div>

        </div>

    </div>

</template>


<script lang="ts" setup>
import { selectedNotes } from '@/composables/useSelectedNotes';



</script>