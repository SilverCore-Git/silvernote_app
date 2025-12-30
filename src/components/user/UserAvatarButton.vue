<script setup lang="ts">
import { UserProfile } from '@clerk/vue';
import UserAvatar from './UserAvatar.vue';
import BackdropOverlay from '../common/BackdropOverlay.vue';
import { ref } from 'vue';

const openProfile = ref<boolean>(false);
</script>

<template>

    <UserAvatar
        @emit-click="openProfile = !openProfile"
    />

    <Teleport to="body">
        <div v-if="openProfile">
            <div class="fixed inset-0 z-100 flex justify-center items-center">
                <UserProfile />
            </div>
            <BackdropOverlay @click="openProfile = false" />
        </div>
    </Teleport>

</template>