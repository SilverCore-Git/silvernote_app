<script setup lang="ts">
import useFilter from '../../composables/useFilter';
import FilteredNotes from '../Notes/FilteredNotes.vue';
import OtherNotes from '../Notes/OtherNotes.vue';
import PinnedNotes from '../Notes/PinnedNotes.vue';

const { selectedFilter } = useFilter();

</script>

<template>

    <div
        class="
            flex-1 overflow-y-auto
            flex flex-col gap-8 pb-10
            h-full
        "
    >

        <PinnedNotes v-if="selectedFilter === 0" />
        <OtherNotes v-if="selectedFilter === 0" />
        
        <FilteredNotes v-if="selectedFilter !== 0" />

    </div>

</template>