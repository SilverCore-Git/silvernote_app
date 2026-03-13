<script setup lang="ts">

import { useRouter } from 'vue-router';
import { ShareByMe, SharedNotes, ShareByMeShare } from '@/assets/ts/database/Var';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';
import type { Note } from '@/assets/ts/type';
import { onMounted, ref } from 'vue';
import { api_url } from '@/assets/ts/backend_link';
import useToken from '@/composables/useToken';

const router = useRouter();
const loading = ref<boolean>(true);

//const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

onMounted(async () => {

    if (ShareByMe.value.length > 0 || SharedNotes.value.length > 0) 
    {
        loading.value = false;
    }

    const token = await useToken();

    const [ShareByMeRes, SharedNotesRes] = await Promise.all([

        fetch(`${api_url}/api/share/by/me`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json()),

        fetch(`${api_url}/api/share/for/me`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json())

    ]);

    const shareByMeNotes = ShareByMeRes?.notes as Note[] || [];
    
    ShareByMe.value = shareByMeNotes;

    // if (shareByMeNotes.length > 0) 
    // {
        
    //     ShareByMe.value.push(shareByMeNotes[0]);

    //     if (shareByMeNotes.length > 1)
    //     {

    //         await delay(200);

    //         const remainingNotes = shareByMeNotes.slice(1);
    //         ShareByMe.value.push(...remainingNotes);

    //     }

    // }

    SharedNotes.value = SharedNotesRes?.notes as Note[] || [];
    ShareByMeShare.value = ShareByMeRes?.share || [];

    loading.value = false;

});

</script>

<template>

    <template v-if="loading">

        <div 
            class="flex justify-center text-(--text-little) items-center h-40"
        >
            <i class="bi bi-arrow-repeat text-4xl animate-spin" />
        </div>
        
    </template>

    <template v-else class="relative">

        <div 
            class="flex flex-col gap-4 h-full pb-40"
            v-if="SharedNotes.length || ShareByMe.length"
        >

            <span 
                v-if="SharedNotes && SharedNotes.length"
                class=" uppercase text-md font-semibold text-(--text-little) "
            >
                Notes partagées visité récemment
            </span>

            <ul
                class="
                    grid gap-4
                    grid-cols-1
                    lg:grid-cols-2
                "
                v-if="SharedNotes && SharedNotes.length"
            >
                <li
                    v-for="(note, index) in SharedNotes"
                    :key="'sharedNotes-'+index"
                    @click.stop="router.push('/share/'+note.uuid)"
                    class="cursor-pointer hover:scale-102! transition-all"
                >
                    <DefaultNoteCard
                        :uuid="note.uuid"
                        :title="note.title"
                        :icon="note.icon"
                        :tags="note.tags"
                        :sharedBy="note.user_id"
                    />
                </li>
            </ul>

            <span 
                v-if="ShareByMe && ShareByMe.length"
                class=" uppercase text-md font-semibold text-(--text-little) "
            >
                Mes notes partagées
            </span>

            <ul
                class="
                    grid gap-4
                    grid-cols-1
                    lg:grid-cols-2
                "
                v-if="ShareByMe && ShareByMe.length"
            >
                <li
                    v-for="(note, index) in ShareByMe"
                    :key="'shareByMe-'+index"
                    @click="router.push('/share/'+note.uuid)"
                    class="cursor-pointer hover:scale-102! transition-all"
                >
                    <DefaultNoteCard
                        :uuid="note.uuid"
                        :title="note.title"
                        :icon="note.icon"
                        :tags="note.tags"
                        :sharedBy="note.user_id"
                        :share="ShareByMeShare.find(s => s.note_uuid === note.uuid)"
                    />
                </li>
            </ul>

        </div>

        <div
            v-else
            class="flex flex-col justify-center items-center my-20"
        >
            <i class="bi bi-search text-6xl mb-4 opacity-20" />
            <h3 class="text-2xl font-bold">Aucune note partagée</h3>
        </div>

    </template>

</template>
