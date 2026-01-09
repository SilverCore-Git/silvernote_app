<script setup lang="ts">
import { useRoute } from 'vue-router';
import useFilter from '../../composables/useFilter';
import FilteredNotes from '../Notes/FilteredNotes.vue';
import OtherNotes from '../Notes/OtherNotes.vue';
import PinnedNotes from '../Notes/PinnedNotes.vue';
import NotesByQuery from '../Notes/NotesByQuery.vue';

const { selectedFilter } = useFilter();
const route = useRoute();

</script>

<template>

    <div
        class="
            flex-1 overflow-y-auto
            flex flex-col gap-8 pb-10
            h-full
        "
    >

        <PinnedNotes v-if="!route.query.q?.length && selectedFilter === 0" />
        <OtherNotes v-if="!route.query.q?.length && selectedFilter === 0" />
        
        <FilteredNotes v-if="!route.query.q?.length && selectedFilter !== 0" />

        <NotesByQuery v-if="route.query.q?.length && selectedFilter === 0" />

    </div>

</template>