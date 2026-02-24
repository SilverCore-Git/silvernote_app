<template>

    <SearchANote
        v-if="note?.uuid === 'new'"
        @note="setNote"
    />

    <NodeViewWrapper class="note-btn-link">
        
        <button
            class="
                flex items-center gap-2 px-3 py-1 rounded-lg my-3
                bg-(--bg2)/70 hover:bg-(--bg2) text-(--text) cursor-pointer
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

import SearchANote from '@/components/notes/searchANote.vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { saveNote } from '../../Function/saveNote'
import { Notes } from '@/assets/ts/database/Var'

const props = defineProps({
    ...nodeViewProps,
})

const router = useRouter()

type NoteType = {
    title: string
    icon?: string
    uuid: string
}

const note = ref<NoteType | null>(null)

onMounted(() => {

    // valeur par défaut
    note.value = { title: '', uuid: 'new', icon: '' }

    if (props.node.attrs.noteId === 'new') 
    {
        note.value.uuid = 'new'
    } 
    else 
    {
        try {
            const foundNote = Notes.value.find(
                (n) => n.uuid === props.node.attrs.noteId
            ) as NoteType | undefined

            if (foundNote) {
                note.value = foundNote
            }
        } catch (e) {
            console.error('Erreur récupération note :', e)
        }
    }

})

const setNote = async (noteId: string) => {
    
    const foundNote = Notes.value.find(n => n.uuid === noteId)

    if (!foundNote) return

    note.value = foundNote
    props.updateAttributes({ noteId })
    await saveNote(noteId)

}

const handleClick = () => {
    if (!note.value) return
    router.push(`/edit/${note.value.uuid}`)
}

</script>