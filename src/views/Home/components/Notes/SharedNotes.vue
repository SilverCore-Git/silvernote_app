<script setup lang="ts">

import { useRouter } from 'vue-router';
import { SharedNotes } from '@/assets/ts/database/Var';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';
import type { Note } from '@/assets/ts/type';
import { onMounted, ref } from 'vue';
import { api_url } from '@/assets/ts/backend_link';
import { useToken } from '@/composables/useToken';

const router = useRouter();

const ShareByMe = ref<Note[]>([]);

onMounted(async() => {
    const { token, waitUntilReady } = useToken();
    await waitUntilReady();

    ShareByMe.value = (await fetch(`${api_url}/api/share/by/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.value}`
        }
    }).then(res => res.json())).notes as Note[];
})

</script>

<template>

    <div class="relative">

        <div 
            class="flex flex-col gap-4 h-full "
            v-if="SharedNotes || ShareByMe"
        >

            <span 
                v-if="SharedNotes && SharedNotes.length"
                class=" uppercase text-md font-semibold text-(--text-little) "
            >
                Notes partagées
            </span>

            <ul
                class="
                    sm:flex sm:flex-wrap
                    grid grid-cols-2
                    gap-4
                "
                v-if="SharedNotes && SharedNotes.length"
            >
                <li
                    v-for="(note, index) in SharedNotes"
                    :key="index"
                    @click.stop="router.push('/share/'+note.uuid)"
                    class="w-[250px]"
                >
                    <DefaultNoteCard
                        :uuid="note.uuid"
                        :title="note.title"
                        :content="note.content"
                        :icon="note.icon"
                        :tags="note.tags"
                    />
                </li>
            </ul>

            <span 
                v-if="ShareByMe && ShareByMe.length"
                class=" uppercase text-md font-semibold text-gray-500 "
            >
                Mes notes partagées
            </span>

            <ul
                class="
                    sm:flex sm:flex-wrap
                    grid grid-cols-2
                    gap-4
                "
                v-if="ShareByMe && ShareByMe.length"
            >
                <li
                    v-for="(note, index) in ShareByMe"
                    :key="index"
                    @click="router.push('/share/'+note.uuid)"
                    class="sm:max-w-[250px]"
                >
                    <DefaultNoteCard
                        :uuid="note.uuid"
                        :title="note.title"
                        :content="note.content"
                        :icon="note.icon"
                        :tags="note.tags"
                    />
                </li>
            </ul>

        </div>

        <div
            v-else
            class="flex flex-col justify-center items-center my-20"
        >
            <i class="bi bi-search text-6xl mb-4 opacity-20"></i>
            <h3 class="text-2xl font-bold">Aucun résultat trouvé</h3>
        </div>

    </div>

</template>
