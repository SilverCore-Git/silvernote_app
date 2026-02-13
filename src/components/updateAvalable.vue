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
    window.location.reload();
};

const checkForUpdates = async () => {
    try {
        const response = await fetch(
            'https://raw.githubusercontent.com/silvercore-git/silvernote_app/main/package.json'
        );
        const data = await response.json();
        if (data.version !== version) {
            updateAvailable.value = true;
        }
    } catch (error) {
        console.error('Error checking for updates:', error);
    }
};

onMounted(() => {

    setTimeout(async () => {

        await checkForUpdates();

    }, 1500);

    setInterval(async () => {

        await checkForUpdates();

    }, 60 * 60 * 1000); // Check every hour

})

</script>