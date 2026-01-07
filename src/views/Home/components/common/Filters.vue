<script setup lang="ts">
import FilterCard from './FilterCard.vue';
import { Tags } from '@/assets/ts/database/Var';
</script>

<template>

    <div
        class="
            flex flex-row justify-start items-center
            pl-1 gap-4
        "
    >

        <span class=" uppercase opacity-60 text-sm">Filtres :</span>

        <ul
            class="flex flex-row justify-center items-center gap-4 overflow-x-auto max-w-200"
        >
            <ul
                class="flex flex-row justify-center items-center gap-2 overflow-x-auto max-w-200"
            >
                <li
                    v-for="tag in Tags"
                >
                    <FilterCard
                        :color="tag.color"
                        :name="tag.name"
                    />
                </li>
            </ul>
            
            <li>
                <div
                    class="
                        bg-(--white) border border-(--btn) border-dashed
                        flex justify-center items-center gap-1 flex-row
                        px-3 py-1.5 text-(--btn) rounded-2xl cursor-pointer
                        min-w-18
                    "
                >
                    
                    <span  class=" text-xs">
                        <i class="bi bi-plus" />
                        Filtre
                    </span>
                </div>
            </li>

        </ul>

    </div>

</template>