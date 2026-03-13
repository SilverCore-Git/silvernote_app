<template>

<div>

    <Teleport to="body">

        <div>

            <div 
                v-if="visible" 
                class="fixed inset-0 z-90 bg-transparent cursor-default" 
                @click="emitClose" 
                @contextmenu.prevent="emitClose"
            />

            <transition name="fade-slide">

                <div
                    v-if="visible"
                    class="
                        fixed z-100
                    "
                    :style="{ 
                        left: `${props.x}px`,
                        top: `${props.y}px`
                    }"
                >

                    <div class="dropdown ">

                        <ul>

                            <li @click="openNoteNewTab">Ouvrir dans un nouvel onglet</li>
                            <li @click="togglePin(); emitClose();">{{ note.pinned ? 'Dé-épingler' : 'Épingler'}}</li>
                            <li @click="toggleNoteSelect(props.uuid); emitClose();">Selectionner</li>

                            <hr />

                            <li @click="showTagMenu = true; emitClose();">Modifier les tags</li>
                            <li @click="showShareMenu = true; emitClose();">Partager</li>

                            <hr />
                            
                            <li @click="showStatsPopup = true; emitClose();">Informations</li>

                            <li class="text-red-600" @click="deleteNote(1)">
                                Supprimer
                            </li>

                        </ul>

                    </div>
                
                </div>

            </transition>

            <share_menu
                :uuid="uuid || note.uuid"
                :title="note.title"
                v-model="showShareMenu"
            />

            <NoteParamsOverlay
                :uuid="note.uuid"
                :justTags="true"
                :selectedTags="note.tags || []"
                v-model:visible="showTagMenu"
            />

            <ConfirmDialog
                :visible="showConfirmDel"
                title="Supprimer vôtre note"
                message="êtes vous sur de vouloir supprimer votre note ?"
                @cancel="showConfirmDel = false"
                @confirm="deleteNote(2)"
            />

            <NotesStatsPopup
                v-model:visible="showStatsPopup"
                :note="note"
            />

        </div>

    </Teleport>

</div>

</template>

<script setup lang="ts">

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Notes } from '@/assets/ts/database/Var';
import share_menu from '@/components/popup/share_menu.vue';
import ConfirmDialog from '@/components/popup/ConfirmDialog.vue';
import { useWSocket } from '@/composables/WSocket';
import { useRouter } from 'vue-router';
import { toggleNoteSelect } from '@/composables/useSelectedNotes';
import NotesStatsPopup from '@/views/Edit/common/NotesStatsPopup.vue';
import NoteParamsOverlay from './NoteParamsOverlay.vue';


const props = defineProps<{
    visible: Boolean;
    uuid: string;
    x: number;
    y: number;
}>();


const router = useRouter();

const note = computed(() => Notes.value.find(note => note.uuid === props.uuid));

const showShareMenu = ref<boolean>(false);
const showConfirmDel = ref<boolean>(false);
const showStatsPopup = ref<boolean>(false);
const showTagMenu = ref<boolean>(false);



const emit = defineEmits([
    'update:visible',
    'TagsCallback'
]);

const emitClose = () => {
    save();
    emit('update:visible', false);
};

const deleteNote = async (state: number) => {
    if (state == 1)
    {
        showConfirmDel.value = true;
        emitClose();
    }
    else
    {
        showConfirmDel.value = false;
        if (!props.uuid) return;
        (await useWSocket()).value.emit('note:delete', note.value);
        Notes.value = Notes.value.filter(_note => _note.uuid !== props.uuid);
        emitClose();
    }
}

const togglePin = async () => {

    if (!note.value) return;

    const index = Notes.value.findIndex(n => n.uuid === props.uuid);
    const newNote = { ...note.value, pinned: !note.value.pinned};

    if (index !== -1) {
        Notes.value[index] = newNote;
    }

    (await useWSocket()).value.emit('note:update', newNote);

};

const openNoteNewTab = () => {

    const routeData = router.resolve({ 
        name: 'Edit',
        params: { uuid: props.uuid } 
    });
  
  window.open(routeData.href, '_blank');

};


const save = async () => {
    
    if (!note.value) return;

    const index = Notes.value.findIndex(n => n.uuid === props.uuid);

    if (index !== -1) {
        Notes.value[index] = { ...note.value };
    }

    (await useWSocket()).value.emit('note:update', note.value);

};


const handleEsc = (e: KeyboardEvent) => {
    if (e.key == 'Escape') emitClose();
};

onMounted(() => window.addEventListener('keydown', handleEsc));

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEsc);
    document.body.style.overflow = '';
});


</script>
