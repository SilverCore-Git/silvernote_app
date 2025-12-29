<template>
    <div @click="emit('emitClick')">
        <UserAvatar
            :appearance="{
                elements: {
                    userAvatarBox: {
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%'
                    }
                }
            }"
        />
    </div>
</template>

<script lang="ts" setup>

import { UserAvatar } from '@clerk/vue'; 

const emit = defineEmits([
    "emitClick"
])

</script>