<script setup lang="ts">
import PinnedNote from '../common/PinnedNote.vue';

</script>

<template>

    <div>

        <span class=" uppercase text-md">
            <i class="bi bi-pin mr-1" />
            Notes épinglés
        </span>

        <ul>
            <li v-for="value in 3">
                <PinnedNote 
                    title="f sdjkfj sdqlkjf sdl"
                    content="Lorem ipsum fkgds plo jlkdfsj glkfjlkfgd jkldfsg"
                    icon=""
                    :tags="[1, 2, 3]"
                />
            </li>
        </ul>

    </div>

</template>
