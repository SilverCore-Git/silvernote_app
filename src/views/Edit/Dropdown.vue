<template>

    <transition name="fade-slide">

        <div v-if="visible" class="z-100 pointer-events-auto">
                
            <div class="dropdown absolute right-0 top-14">

                <ul @click="emit('update:visible')">

                    <li v-if="editor" @click="undo">Annuler</li>
                    <li v-if="editor" @click="redo">Rétablir</li>

                    <hr v-if="!isMobile" />

                    <li v-if="!isMobile" @click="export_menu = true">Exporter</li>
                    <li v-if="!isMobile" @click="import_menu = true">Importer</li>

                    <hr />

                    <li @click="share_menu = true">Partager</li>

                    <hr />

                    <li @click="stats_popup = true">Informations</li>

                    <li class="text-red-600" @click="showDialog = true">
                        Supprimer
                    </li>

                </ul>

            </div>

        </div>

    </transition>

  
    <share_menu
        :uuid="note.uuid"
        :title="note.title"
        v-model="share_menu"
    />


    <confirm-dialog
        :visible="showDialog"
        title="Confirmation"
        message="Voulez-vous vraiment supprimer cette note ?"
        @confirm="delete_note(2)"
        @cancel="showDialog = false"
    />

    <note-params-overlay
        v-model:visible="tagManager"
        :uuid="note.uuid"
        :justTags="true"
    />

    <import
        v-model:visible="import_menu"
        :uuid="uuid"
    />

    <export
        v-model:visible="export_menu"
        :note="note"
    />

    <notes-stats-popup
        v-model:visible="stats_popup"
        :note="note"
    />


</template>

<script setup lang="ts">

import { computed, nextTick, ref } from 'vue'
import { editor } from '@/components/Markdown/Editor'
import Import from './common/Import.vue';
import Export from './common/Export.vue';
import NoteParamsOverlay from '../Home/components/common/NoteParamsOverlay.vue';
import Share_menu from '@/components/popup/share_menu.vue';
import ConfirmDialog from '@/components/popup/ConfirmDialog.vue';
import { Notes } from '@/assets/ts/database/Var';
import { useRouter } from 'vue-router';
import isMobile from '@/assets/ts/utils/isMobile';
import NotesStatsPopup from './common/NotesStatsPopup.vue';
import { useWSocket } from '@/composables/WSocket';

const props = defineProps<{
  visible: boolean;
  uuid: string;
}>()

const note = computed(() => Notes.value.find(note => note.uuid === props.uuid));

const emit = defineEmits(['update:visible'])

const router = useRouter();
const tagManager = ref<boolean>(false);
const export_menu = ref<boolean>(false);
const stats_popup = ref<boolean>(false);
const import_menu = ref<boolean>(false);
const share_menu = ref<boolean>(false);
const showDialog = ref<boolean>(false);


const undo = () => editor.value?.chain().focus().undo().run()
const redo = () => editor.value?.chain().focus().redo().run()

const delete_note = async (state: number) => {
    if (state === 1) return showDialog.value = true;
    if (state === 2)
    {

        router.push('/');
        
        await nextTick();

        (await useWSocket()).value.emit('note:delete', note.value);
        Notes.value = Notes.value.filter(_note => _note.uuid !== props.uuid);

    }
}

</script>
