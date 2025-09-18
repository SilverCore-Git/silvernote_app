<template>

  <header class="flex flex-row relative" style="padding-top: calc(1rem + env(safe-area-inset-top)/2);">

    <div 
        class="left-arrow absolute left-0 cursor-pointer btnHover" 
        @click="router.push('/')"
    ></div>

    <div 
        class="absolute right-0 cursor-pointer btnHover" 
    >
        <img
            v-if="share"
            class="w-10 h-10"
            :src="getUserPP(share.user_id)"
        >
    </div>

  </header>

    <section 
        v-if="loaded && note"  
        class="flex flex-col justify-center items-center h-full mb:mr-[10%] mb:ml-[10%] mt-12 overflow-x-hidden "
    >

        <div class="w-full flex justify-start ml-[10%]">

        <button ref="emojiBtn">

            <img
                v-if="note.icon" 
                class="w-[64px] h-[64px] cursor-pointer" 
                :src="note.icon" 
            />

        </button>
        
        </div>

        <input 
            class="text-3xl mb-3 font-bold" 
            type="text" 
            placeholder="Titre..." 
            ref="title"
            v-model="note!.title"
            @input="saveTitle()"
            :readonly="!editable"
        />

        <RichMarkdownEditor 
            v-if="note && socket"
            :id="-2" 
            :data="note" 
            :editable="editable" 
            :uuid="uuid"
            :socket="socket"
        />

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


    <div
        v-if="error !== ''"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >

        <div
            class="bg-[var(--bg2)] rounded-2xl shadow-xl p-6 m-4 w-full max-w-md text-sm border border-gray-300 dark:border-zinc-700"
        >
            <h2 class="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">
                {{ error }}
            </h2>

            <div class="flex flex-col gap-5">

                <div class="flex justify-end gap-3 mt-6">

                    <button
                        class="primary"
                        @click="router.push('/')"
                    >
                        Accueil
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
import RichMarkdownEditor from '@/components/Markdown/RichMarkdownEditor.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { io, Socket } from 'socket.io-client';


const props = defineProps<{
    uuid: string;
}>()

const router = useRouter();

const note = ref<Note | undefined>(undefined);
const error = ref<string>('');
const need_passwd = ref<boolean>(false);
const loaded = ref<boolean>(false);
const passwd = ref<string>('');
const share = ref<any>(null);

let editable: boolean;
let socket: Socket;

const getUserPP = (user_id: string): string => {

    let res: any;
    (async () => {
        res = fetch(`${api_url}/api/user/icon/by/id/${user_id}`).then(res => res.json());
    })
    return res?.imageUrl;

} 

const saveTitle = () => {
    socket.emit('edit_note', { 
        uuid: note.value?.uuid,
        content: note.value?.content,
        title: note.value?.title
    })
}


const _fetch = async () => {

    const _share = await fetch(`${api_url}/api/share/${props.uuid}?passwd=${passwd.value}`, { 
        credentials: 'include'
    }).then(res => res.json());

    if (_share.error) {
        error.value = _share.message;
        loaded.value = true;
        return;
    }

    if (_share.expired) {
        error.value = 'Ce partage à expiré.';
        loaded.value = true;
        return;
    }

    if (_share.success) {
        note.value = _share.note;
        need_passwd.value = false;
        editable = _share.editable;
        share.value = _share
        loaded.value = true;
        wSocket();
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



const wSocket = () => {

    socket = io(api_url, { path: "/socket.io/" });

    socket.on('connect', () => {
        console.log('WebSocket connecté !');
        socket.emit('join_share', { uuid: note.value?.uuid });
    });

    socket.on('update_note', (data: { content: string; title: string }) => {
        if (!note.value) return;
        note.value.content = data.content;
        note.value.title = data.title;
    });

    socket.on('disconnect', () => {
        console.log('WebSocket déconnecté !');
    });

};



onMounted(() => _fetch())

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
