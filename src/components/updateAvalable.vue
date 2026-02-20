<template>

    <transition name="go-to-the-top" appear>

        <div
            v-if="updateAvailable && host == 'app.silvernote.fr'"
            class="absolute top-0 inset-x-0 bg-(--white) border-b border-(--btn) p-4 z-100 gap-4 flex flex-wrap justify-between items-center"
            role="alert"
        >
            
            <p class="flex flex-wrap gap-2">
                <h3 class="font-bold text-xl">Mise à jour disponible : </h3>
                Une nouvelle version de SilverNote est disponible. Veuillez mettre à jour pour la meilleure expérience.
            </p>

            <div class="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                    @click="reload"
                    class="default-primary w-full sm:w-auto"
                >
                    Mettre à jour
                </button>
                <button
                    @click="updateAvailable = false"
                    class="primary danger w-full sm:w-auto"
                >
                    Plus tard
                </button>
            </div>

        </div>

    </transition>

</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import { version } from '../../package.json';

const host = window.location.hostname;
const updateAvailable = ref<boolean>(false);

const reload = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('cache_bust', Date.now().toString());
    window.location.href = url.toString();
};

const checkForUpdates = async () => {
    try {
        const response = await fetch(
            `https://raw.githubusercontent.com/silvercore-git/silvernote_app/main/package.json?cache_bust=${Date.now()}`
        );
        if (!response.ok) return;
        const data = await response.json();
        if (data.version !== version) {
            updateAvailable.value = true;
        }
    } catch (error) {
        console.error('Error checking for updates:', error);
    }
};

const checkIsOnUpdate = async () => {
    try {
        const response = await fetch(
            `/score-host/api/status?cache_bust=${Date.now()}`
        );
        if (!response.ok) return;
        const data = await response.json();
        if (
            data.service.onUpdate 
            || data.service.errored 
            || data.service.maintenance
        )
        {
            reload();
        }
    } catch (error) {
        console.error('Error checking for updates:', error);
    }
};

onMounted(() => {

    setTimeout(async () => {

        await checkForUpdates();
        await checkIsOnUpdate();

    }, 1500);

    setInterval(async () => {

        await checkForUpdates();
        await checkIsOnUpdate();

    }, 5 * 60 * 1000); // Check every 5mn

})

</script>