<script setup lang="ts">
import { selectedNotes } from '@/composables/useSelectedNotes';
import Filters from '../common/Filters.vue';
import SearchBar from '../common/SearchBar.vue';
import SelectedNoteOptions from './SelectedNoteOptions.vue';

</script>

<template>

    <div
        class="
            flex gap-4 flex-col
            max-w-200
        "
    >

        <Transition name="go-to-the-top" mode="out-in" class="h-14">
            <SelectedNoteOptions 
                v-if="selectedNotes.length > 0" 
                key="selection-mode" 
            />
            <SearchBar 
                v-else 
                key="search-mode" 
            />
        </Transition>
        <Filters />

    </div>

</template>