<template>

    <NodeViewWrapper class="note-btn-link">
        
        <button
            class="
                    flex items-center gap-2 px-3 py-1 rounded-lg my-3
                    bg-gray-100 hover:bg-gray-200 cursor-pointer
                "
            @click="handleClick"
        >
            <img v-if="note?.icon" :src="note.icon" class="w-6 h-6" />
            <div v-else class="bi bi-file-earmark font-extrabold text-10" />
            <span>{{ note?.title || 'Note sans titre' }}</span>
        </button>

    </NodeViewWrapper>

</template>

<script setup lang="ts">

import database from '@/assets/ts/database/database'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { onMounted, ref } from 'vue'
import {  useRouter } from 'vue-router'

const props = defineProps({
    ...nodeViewProps,
})

const router = useRouter();
const note = ref<{ title: string; icon?: string, id: number } | null>(null)

onMounted(async () => {
    note.value = { title: '', id: -1, icon: '' }

    if (props.node.attrs.noteId === -3) {
        note.value.title = 'Titre'
    } else {
        try {
            note.value = await database.getNote(props.node.attrs.noteId) as { title: string, icon?: string, id: number }
        } catch (e) {
            console.error('Erreur récupération note :', e)
        }
    }
})

const handleClick = async () => {
    if (!note.value) return;
    router.push(`/edit/${props.node.attrs.noteId}?from=${note.value.id}`)
}

</script>
