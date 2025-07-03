<template>

<header class="flex flex-row relative z-50" style="padding-top: calc(1rem + env(safe-area-inset-top)/2);">
    <div class="left-arrow absolute left-0 z-50" :class="hitbox ? 'bg-red-600' : ''" @click="router.push('/')"></div>
</header>

<div class="w-screen h-screen flex justify-center items-center">
    <div>

        <SignOutButton class="mb-10">
            <button class="primary danger">
                Se déconnecter
            </button>
        </SignOutButton>
    
        <UserProfile />

    </div>
</div>

</template>


<script lang="ts" setup>

    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router';

    import { hitbox as if_hitbox } from '../assets/ts/settings';
    import { SignOutButton, UserProfile } from '@clerk/vue';

    let hitbox: boolean;
    onMounted(async () => { hitbox = await if_hitbox() })

    const router = useRouter();


</script>