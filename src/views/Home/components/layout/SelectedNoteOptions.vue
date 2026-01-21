<template>

    <div class="flex justify-center items-center gap-4">

        <div
            class="
                flex justify-between items-center flex-row 
                border rounded-2xl bg-(--white)
                py-3 px-4 w-full gap-2.5
                transition-all duration-300 ease-in-out
            "
        >

            <div class="flex justify-center items-center gap-2">
                <a class="p-1">
                    <i class=" bi bi-x " />
                </a>
                <span>{{ selectedNotes.length }}</span>
            </div>

            <div
                class="
                    flex justify-center items-center
                    gap-4 mr-1
                "
            >

                <a 
                    class="p-1"
                    v-if="selectedNotes.length <= 1"
                    @click="selectedNote[0].pinned = !selectedNote[0].pinned"
                >
                    <i 
                        class="bi"
                        :class="
                            selectedNote?.[0].pinned
                                ? 'bi-pin-fill'
                                : 'bi-pin'
                        "   
                    />
                </a>


                <a
                    class="p-1"
                    v-if="selectedNotes.length <= 1"
                    @click="showShareMenu = true"
                >
                    <i 
                        class="bi bi-share-fill"
                    />
                </a>

                <a
                    class="p-1"
                    @click="showParamsOverlay = true"
                    v-if="selectedNotes.length <= 1"
                >
                    <i 
                        class="bi"
                        :class="'bi-tag-fill'"   
                    />
                </a>
                

                <a
                    class="p-1 text-red-600"
                    @click="deleteNotes(1)"
                >
                    <i 
                        class="bi"
                        :class="'bi-trash-fill'"   
                    />
                </a>
                

            </div>

        </div>

    </div>

    <note-params-overlay
        v-model:visible="showParamsOverlay"
        :uuid="selectedNote[0].uuid"
        :justTags="true"
    />

    <share_menu
        v-if="selectedNote[0].uuid"
        :uuid="selectedNote[0].uuid"
        v-model="showShareMenu"
    />

    <ConfirmDialog
        :visible="showConfirmDel"
        title="Supprimer les notes séléctionnées"
        message="êtes vous sur de vouloir supprimer vos note ?"
        @cancel="showConfirmDel = false"
        @confirm="deleteNotes(2)"
    />

</template>


<script lang="ts" setup>
import { Notes } from '@/assets/ts/database/Var';
import { selectedNotes } from '@/composables/useSelectedNotes';
import { computed, ref } from 'vue';
import NoteParamsOverlay from '../common/NoteParamsOverlay.vue';
import Share_menu from '@/components/popup/share_menu.vue';
import database from '@/assets/ts/database/database';

const showParamsOverlay = ref<boolean>(false);
const showShareMenu = ref<boolean>(false);
const showConfirmDel = ref<boolean>(false);



const selectedNote = computed(() => {
  return Notes.value.filter(note => selectedNotes.value.includes(note.uuid));
});

// const selectedTags = computed(() => {
//   if (selectedNote.value.length === 0) return [];

//   return selectedNote.value.length === 1
//     ? selectedNote.value[0].tags
//     : selectedNote.value.flatMap(note => note.tags);
// });

// const saveTags = async (tags: number[]) => {

//     try {

//         for (const note of selectedNote.value) {

//             const index = Notes.value.findIndex(n => n.uuid === note.uuid);

//             if (index === -1) continue;

//             Notes.value[index].tags = tags;

//             await database.update(Notes.value[index]);

//         }

//         showParamsOverlay.value = false;

//     } catch (err) {
//         throw new Error(`Erreur on SelectedNoteOptions.vue, on saveTags() : ${err}`);
//     }

// }

const deleteNotes = async (state: number) => {

    if (state == 1)
    {
        showConfirmDel.value = true;
        
    }
    else
    {
        showConfirmDel.value = false;
        for (const note of selectedNote.value) {
            
            await database.delete(note.uuid);
            Notes.value = Notes.value.filter(_note => _note.uuid !== note.uuid);
        

        }

    }

}


</script>