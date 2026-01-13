<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router';
import useFilter from '../../composables/useFilter';
import FilteredNotes from '../Notes/FilteredNotes.vue';
import OtherNotes from '../Notes/OtherNotes.vue';
import PinnedNotes from '../Notes/PinnedNotes.vue';
import NotesByQuery from '../Notes/NotesByQuery.vue';
import { computed } from 'vue';
import SharedNotes from '../Notes/SharedNotes.vue';
import { Notes } from '@/assets/ts/database/Var';

const { selectedFilter } = useFilter();
const route = useRoute();
const router = useRouter();

const searchQuery = computed(() => (route.query.q ? String(route.query.q).trim() : ''));
const pageQuery = computed(() => (route.query.page ? String(route.query.page).trim() : ''));
const hasPinnedNotes = computed(() => Notes.value.some(note => note.pinned == true));
const hasNotPinnedNotes = computed(() => Notes.value.some(note => note.pinned !== true));

</script>

<template>

    <div
        class="flex-1 overflow-y-auto flex flex-col gap-8 pb-40 h-full"
        v-if="Notes.length || pageQuery == 'shared'"
    >

        <template v-if="pageQuery === 'shared'">
            <SharedNotes />
        </template>

        <template v-else-if="searchQuery">
            <NotesByQuery />
        </template>

        <template v-else>

            <template v-if="selectedFilter && selectedFilter !== 0">
                <FilteredNotes />
            </template>

            <template v-else>
                <PinnedNotes v-if="hasPinnedNotes" />
                <OtherNotes v-if="hasNotPinnedNotes" />
            </template>

        </template>

    </div>

    <div
        v-else
        class="
            flex justify-center items-start
            w-full h-full pt-20
        "
    >

        <div class="flex justify-center items-center flex-col gap-4 text-2xl">

            <i class="text-6xl bi bi-journal-x" />
            
            <h2 class="font-semibold">
                Aucune note trouvée
            </h2>

            <button 
                @click="router.push('/edit/new')"
                class="primary"
            >
                Créer une note
            </button>

        </div>


    </div>

</template>