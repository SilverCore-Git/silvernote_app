<template>



    <div
        class="
            fixed bottom-22 md:bottom-10 right-6 z-20 gap-4
            flex flex-col justify-center items-center 
        "
    >

        <!-- SilverIA btn -->
        <Silveria v-if="aiEnabled" />

        <!-- new note btn -->
        <button
            v-if="!route.path.startsWith('/edit') && !route.path.startsWith('/share')"
            @click="openEditNewNote"
            class="
                transition-all! duration-300 ease-in-out
                bg-(--btn) text-(--white)
                w-16 h-16 rounded-2xl shadow-2xl
                flex justify-center items-center
                text-5xl cursor-pointer
                hover:rotate-180 hover:bg-(--btn-hover)
            "
            v-tooltip="tooltipConfig"
        >
            <i class="bi bi-plus" />
        </button>

    </div>

</template>

<script lang="ts" setup>

import { useRoute, useRouter } from 'vue-router';
import Silveria from '../silveria/silveria.vue';
import { nextTick } from 'vue';
import { useShortcut } from '@/composables/useShrotcut';
import useSettingsItem from '@/assets/ts/settings/useSettingsItem';

const route = useRoute();
const router = useRouter();
const { Item: aiEnabled } = useSettingsItem('aiFunc', true);

const openEditNewNote = () => {

    if (!document.startViewTransition) {
        router.push(`/edit/new`);
        return;
    }

    document.startViewTransition(async () => {
        await router.push(`/edit/new`);
        await nextTick(); 
    });
};

const { tooltipConfig } = useShortcut(
    [ 'shift', 'n' ],
    'Créer une note',
    () => {
        openEditNewNote();
    }
)

</script>