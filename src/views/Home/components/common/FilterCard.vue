<template>

    <PressAndHold
        @long-press="showTagMenu = !showTagMenu"
        class="h-full"
    >

        <div 
            class="
                bg-(--white) border-2 rounded-2xl flex-row
                flex justify-center items-center gap-1
                px-3 py-1.5 cursor-pointer duration-100!
            "
            :class="[
                active ? 'border-(--btn)' : 'border-(--text)/40'
            ]"
        >

            <div
                :style="{ backgroundColor: color }"
                class="
                    rounded-full w-3 h-3
                "
            />

            <span
                class=" uppercase text-xs"
            >
                {{ name }}
            </span>

        </div>

    </PressAndHold>

    <FilterParams
        v-model:model-value="showTagMenu"
        :uuid="uuid"
    />

</template>

<script lang="ts" setup>

import PressAndHold from '@/components/PressAndHold.vue';
import { ref } from 'vue';
import FilterParams from './FilterParams.vue';

defineProps<{
    uuid: string;
    color: string;
    name: string;
    active: boolean;
}>();

const showTagMenu = ref<boolean>(false);

</script>