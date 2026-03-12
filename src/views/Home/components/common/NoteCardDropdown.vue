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

                            <li>Ouvrir dans un nouvel onglet</li>
                            <li>Selectionner</li>

                            <hr />

                            <li>Modifier les tags</li>
                            <li @click="showShareMenu = true">Partager</li>

                            <hr />
                            
                            <li @click="">Informations</li>

                            <li class="text-red-600" @click="deleteNote(1)">
                                Supprimer
                            </li>

                        </ul>

                    </div>
                
                </div>

            </transition>

            <share_menu
                v-if="showShareMenu"
                :uuid="uuid || note.uuid"
                :title="note.title"
                v-model="showShareMenu"
            />

            <ConfirmDialog
                :visible="showConfirmDel"
                title="Supprimer vôtre note"
                message="êtes vous sur de vouloir supprimer votre note ?"
                @cancel="showConfirmDel = false"
                @confirm="deleteNote(2)"
            />

        </div>

    </Teleport>

</div>

</template>

<script setup lang="ts">

import BackdropOverlay from '@/components/common/BackdropOverlay.vue';
import type { Note } from '@/assets/ts/type';
import { nextTick, onMounted, ref, watch } from 'vue';
import { Notes, Tags } from '@/assets/ts/database/Var';
import DefaultNoteCard from '@/views/Home/components/common/DefaultNoteCard.vue';
import database from '@/assets/ts/database/database';
import share_menu from '@/components/popup/share_menu.vue';
import ConfirmDialog from '@/components/popup/ConfirmDialog.vue';
import { useWSocket } from '@/composables/WSocket';


const props = defineProps<{
    visible: Boolean;
    uuid: string;
    x: number;
    y: number;
}>();

const note = ref<Note | undefined | any>(undefined);
const showCard = ref<boolean>(false);
const showShareMenu = ref<boolean>(false);
const showConfirmDel = ref<boolean>(false);
const tags = ref<number[]>( []);

const emit = defineEmits([
    'update:visible',
    'TagsCallback'
]);

const emitClose = () => {
  emit('update:visible', false);
};

const deleteNote = async (state: number) => {
    if (state == 1)
    {
        showConfirmDel.value = true;
        
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

const save = () => {
    
    if (!note.value) return;

    if (false) {
        emit('TagsCallback', tags.value);
        emit('update:visible', false);
        return;
    }

    const index = Notes.value.findIndex(n => n.uuid === props.uuid);

    if (index !== -1) {
        Notes.value[index] = { ...note.value };
    }

    database.update(note.value);

    emitClose();
};

const toggleTag = (id: number) => {

    if (!note.value) return;
    
    const index = note.value.tags.indexOf(id);
    
    if (index !== -1) {
        note.value.tags.splice(index, 1);
    } 
    else {
        note.value.tags.push(id);
    }

    refrechCard();
    
}


const togglePin = () => {

    if (!note.value) return;

    note.value.pinned = !note.value.pinned;

    refrechCard();

}

const refrechCard = async () => {
    showCard.value = false;
    await nextTick();
    showCard.value = true;
}


const mount = () => {
    
    if (false) {
        note.value = {};
        tags.value =  [];
        showCard.value = true;
        return;
    }

    const _note = Notes.value.find(note => note.uuid === props.uuid);
    note.value = JSON.parse(JSON.stringify(_note));
    showCard.value = true;
    if (!note) throw new Error('Note is undefined on params overlay !')

}

watch(() => props.visible, () => {
    if (props.visible) mount()
})

onMounted(mount);


</script>
