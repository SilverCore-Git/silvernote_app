<template>

    <transition name="fade-slide">

        <div v-if="visible">
                
            <div class="dropdown absolute right-0 top-14">

                <ul @click="emit('update:visible')">

                    <li @click="tagManager = true">Gérer les tags</li>

                    <hr />

                    <li v-if="editor" @click="undo">Annuler</li>
                    <li v-if="editor" @click="redo">Rétablir</li>

                    <hr />

                    <li @click="export_menu = true">Exporter</li>
                    <li @click="import_menu = true">Importer</li>

                    <hr />

                    <li @click="share_menu = true">Partager</li>
                    <li @click="saveNote(id)">Sauvegarder</li>

                    <hr />

                    <li class="text-red-600" @click="showDialog = true">
                        Supprimer
                    </li>

                    <hr />

                    <li class="flex flex-col">
                        <div class="flex flex-col text-[12px]">
                        <span>
                            Nombre de mots :
                            {{ isLoaded ? stats?.getWordCount() : '...' }}
                        </span>
                        <span>
                            Nombre de caractères :
                            {{ isLoaded ? stats?.getCharacterCount() : '...' }}
                        </span>
                        </div>
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


    <ConfirmDialog
        :visible="showDialog"
        title="Confirmation"
        message="Voulez-vous vraiment supprimer cette note ?"
        @confirm="delete_note(2)"
        @cancel="showDialog = false"
    />

    <note-params-overlay
        v-model:visible="tagManager"
        :id="note.id"
        :justTags="true"
    />

    <import
        v-model:visible="import_menu"
        :id="id"
        :note="note"
    />

    <export
        v-model:visible="export_menu"
        :note="note"
    />

</template>

<script setup lang="ts">

import { ref } from 'vue'
import { stats, isLoaded } from '@/components/Markdown/Function/Stats'
import { editor } from '@/components/Markdown/Editor'
import type { Note } from '@/assets/ts/type';
import Import from './common/Import.vue';
import Export from './common/Export.vue';
import NoteParamsOverlay from '../Home/components/common/NoteParamsOverlay.vue';
import { saveNote } from '@/components/Markdown/Function/saveNote';
import Share_menu from '@/components/popup/share_menu.vue';

defineProps<{
  visible: boolean;
  id: number;
  note: Note;
}>()

const emit = defineEmits(['update:visible'])

const tagManager = ref<boolean>(false);
const export_menu = ref<boolean>(false);
const import_menu = ref<boolean>(false);
const share_menu = ref<boolean>(false);
const showDialog = ref<boolean>(false);


const undo = () => editor.value?.chain().focus().undo().run()
const redo = () => editor.value?.chain().focus().redo().run()

const delete_note = async (state: number) => {
    if (state === 1) return showDialog.value = true;
    if (state === 2)
    {
        
    }
}

</script>
