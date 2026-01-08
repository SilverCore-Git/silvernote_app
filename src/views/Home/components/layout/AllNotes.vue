<script setup lang="ts">
import OtherNotes from '../Notes/OtherNotes.vue';
import PinnedNotes from '../Notes/PinnedNotes.vue';

</script>

<template>

    <div
        class="
            flex-1 overflow-y-auto
            flex flex-col gap-8 pb-10
        "
    >

        <PinnedNotes />
        <OtherNotes />

    </div>

</template>