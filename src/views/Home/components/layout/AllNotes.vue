<script setup lang="ts">
import OtherNotes from '../Notes/OtherNotes.vue';
import PinnedNotes from '../Notes/PinnedNotes.vue';

</script>

<template>

    <div
        class="
             overflow-y-auto overflow-x-hidden
             
        "
    >

        <PinnedNotes />
        <OtherNotes />

    </div>

</template>