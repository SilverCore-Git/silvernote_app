<script setup lang="ts">

import { useRoute } from 'vue-router';
import useFilter from '../../composables/useFilter';
import FilteredNotes from '../Notes/FilteredNotes.vue';
import OtherNotes from '../Notes/OtherNotes.vue';
import PinnedNotes from '../Notes/PinnedNotes.vue';
import NotesByQuery from '../Notes/NotesByQuery.vue';
import { computed } from 'vue';
import SharedNotes from '../Notes/SharedNotes.vue';

const { selectedFilter } = useFilter();
const route = useRoute();

const searchQuery = computed(() => (route.query.q ? String(route.query.q).trim() : ''));
const pageQuery = computed(() => (route.query.page ? String(route.query.page).trim() : ''));

</script>

<template>

    <div class="flex-1 overflow-y-auto flex flex-col gap-8 pb-10 h-full">

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
                <PinnedNotes />
                <OtherNotes />
            </template>

        </template>

    </div>

</template>