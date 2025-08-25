<template>

    <header class="flex flex-row relative" style="padding-top: calc(1rem + env(safe-area-inset-top)/2);">

    </header>

    <section 
        v-if="loaded && note"  
        class="flex flex-col justify-center items-center h-full mb:mr-[10%] mb:ml-[10%] mt-12 overflow-x-hidden"
    >

        <input 
            class="text-3xl mb-3 font-bold" 
            type="text" 
            placeholder="Titre..." 
            ref="title"
            v-model="note!.title"
            @input=""
        />

        <RichMarkdownEditor :id="-2" :data="note" />

    </section>


    <div
        v-if="need_passwd"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >

        <div
            class="bg-[var(--bg2)] rounded-2xl shadow-xl p-6 m-4 w-full max-w-md text-sm border border-gray-300 dark:border-zinc-700"
        >
            <h2 class="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-4">
            Saisir le mot de passe
            </h2>

            <div class="flex flex-col gap-5">
                    
                <div>

                    <label class="block text-base font-medium text-gray-800 dark:text-zinc-300">
                        Mot de passe :
                    </label>

                    <input
                        v-model="passwd"
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm
                                focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-[var(--btn)]
                                dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                    />

                </div>

                <div class="flex justify-end gap-3 mt-6">

                    <button
                        class="primary"
                        @click="_fetch()"
                    >
                        Confirmer
                    </button>

                </div>

            </div>

        </div>

    </div>

    <Loader v-if="!loaded" :icon="false" />

</template>

<script lang="ts" setup>

import { api_url } from '@/assets/ts/backend_link';
import type { Note } from '@/assets/ts/type';
import Loader from '@/components/Loader.vue';
import RichMarkdownEditor from '@/components/RichMarkdownEditor.vue';
import { onMounted, ref } from 'vue';


const props = defineProps<{
    uuid: string;
}>()

const note = ref<Note | undefined>(undefined);
const error = ref<string | boolean>(false);
const need_passwd = ref<boolean>(false);
const loaded = ref<boolean>(false);
const passwd = ref<string>('');

onMounted(() => _fetch())


const _fetch = async () => {

    const share = await fetch(`${api_url}/api/share/${props.uuid}?passwd=${passwd.value}`).then(res => res.json());

    if (share.error) {
        error.value = share.message;
        loaded.value = true;
        return;
    }

    if (share.success) {
        note.value = share.note;
        need_passwd.value = false;
        loaded.value = true;
        return;
    }

    if (share.need == 'passwd') {
        need_passwd.value = true;
        loaded.value = true;
        return;
    }

    if (share.banned) {
        error.value = 'Vous êtes bannis de ce partage.';
        loaded.value = true;
        return;
    }

}

</script>

<style scoped>

textarea,
input {
  border: none;
  outline: none;
  width: 90%;
  text-decoration: none;
}

</style>
