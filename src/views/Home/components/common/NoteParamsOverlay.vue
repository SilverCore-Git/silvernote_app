<template>

<div>

    <Teleport to="body">

        <transition name="fade-slide">
            
            <backdrop-overlay 
                v-if="visible"
                @emit-click="emitClose"
            />

        </transition>

        <transition name="fade-slide">

            <div
                v-if="visible"
                class="
                    fixed inset-0
                    flex justify-center items-center
                    z-100 pointer-events-none
                "
            >

                <div
                    class="
                        max-w-2xl
                        lg:grid lg:grid-cols-[280px_1em_300px]
                        flex justify-center items-center
                        w-full gap-10
                        pointer-events-auto relative
                    "
                >

                    <div class="relative w-full hidden lg:block">

                        <DefaultNoteCard
                            v-if="note && showCard"
                            :uuid="note.uuid"
                            :title="note.title"
                            :content="note.content"
                            :icon="note.icon"
                            :tags="note.tags"
                            inertw="h-full max-h-140"
                        />

                    </div>

                    <div
                        class=" 
                            hidden lg:flex
                            gap-2 mx-auto w-full
                            flex-col justify-center items-center
                            text-4xl font-black
                        "
                    >
                        <i class="bi bi-arrow-right" />
                        <i class="bi bi-arrow-left" />
                    </div>

                    <div class="w-full max-w-80 relative">

                        <div
                            class="
                                bg-(--white) rounded-2xl shadow-xl
                                p-4 w-full text-sm h-full gap-4 flex flex-col
                                border border-[#F28C28]/60 relative
                            "
                        >
                    
                            <a
                                class="absolute top-4 right-4 h-8 w-8 z-100"
                                @click="emitClose"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </a>

                            <h3 class="text-xl font-semibold">
                                Paramètres de la note
                            </h3>

                            <div class="w-full h-full">

                                <span class="text-xs text-(--text-little) uppercase font-semibold">
                                    Tags
                                </span>

                                <ul class="flex flex-col gap-2 max-h-60 h-full overflow-y-auto w-full px-2 overflow-x-hidden ">

                                    <li
                                        v-if="Tags.length > 0"
                                        v-for="tag in Tags"
                                        :key="tag.id"
                                    >

                                        <label
                                            class="
                                                flex items-center justify-between border rounded-xl cursor-pointer
                                                p-3 bg-(--bg)/80 hover:scale-102 transition select-none
                                            "
                                            :for="`switch-${tag.id}`"
                                        >
                                            
                                            <div class="flex items-center gap-3">
                                                <div
                                                    class="w-4 h-4 rounded-full border border-gray-400"
                                                    :style="{ backgroundColor: tag.color || '#ccc' }"
                                                ></div>
                                                <span class="text-base font-medium truncate max-w-[150px]">
                                                    {{ tag.name || '...' }}
                                                </span>
                                            </div>

                                            <div class="relative inline-flex items-center ">

                                                <input
                                                    :id="`switch-${tag.id}`"
                                                    type="checkbox"
                                                    class="sr-only peer"
                                                    :checked="justView ? note?.tags?.includes(tag.id) : tags.includes(tag.id)"
                                                    @change="justView ? () => {} : toggleTag(tag.id)"
                                                />

                                                <div
                                                    class="
                                                        w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 
                                                        peer-focus:ring-(--btn) rounded-full peer
                                                        peer-checked:bg-(--btn) transition-all
                                                    "
                                                ></div>

                                                <div
                                                    class="absolute left-0.5 top-0.5 w-5 h-5 bg-white
                                                    rounded-full transition-transform peer-checked:translate-x-5"
                                                ></div>

                                            </div>

                                        </label>

                                    </li>

                                    <li
                                        v-else
                                        class="flex justify-center items-center font-bold"
                                    >
                                        <span>Aucun tag trouvé</span>
                                    </li>

                                </ul>

                            </div>

                            <div
                                v-if="!justTags"
                                class="
                                    group flex items-center justify-between 
                                    border rounded-xl cursor-pointer p-4 
                                    transition-all duration-200 ease-out
                                    select-none
                                "
                                :class="note?.pinned 
                                    ? 'bg-(--btn)/10 border-(--btn) shadow-(--btn)/20 shadow-sm' 
                                    : 'bg-(--bg)/50 border-gray-200 hover:border-(--btn) hover:bg-(--bg)'
                                "
                                @click.stop="togglePin()"
                            >
                                
                                <div class="flex items-center gap-3">
                                    
                                    <div 
                                        class="
                                            w-8 h-8 rounded-full flex items-center justify-center
                                            transition-colors duration-300
                                        "
                                        :class="note?.pinned ? 'bg-(--btn) text-white' : 'bg-gray-100 text-gray-400 group-hover:text-(--btn)'"
                                    >
                                        <i class="bi" :class="note?.pinned ? 'bi-pin-fill' : 'bi-pin'" />
                                    </div>

                                    <div class="flex flex-col">
                                        <span class="text-sm font-bold text-(--text)">
                                            {{ note?.pinned ? 'Note épinglée' : 'Épingler la note' }}
                                        </span>
                                        <span class="text-[10px] text-(--text-little)">
                                            {{ note?.pinned ? 'Apparaît en haut de la liste' : 'Gardez cette note à portée de main' }}
                                        </span>
                                    </div>
                                </div>

                                <div class="relative inline-flex items-center pointer-events-none">
                                    
                                    <input
                                        type="checkbox"
                                        class="sr-only peer"
                                        :checked="note?.pinned"
                                    />
                                    
                                    <div
                                        class="
                                            w-11 h-6 bg-gray-200 
                                            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-(--btn)/50 
                                            rounded-full peer 
                                            peer-checked:bg-(--btn)
                                            transition-colors duration-300
                                        "
                                    ></div>

                                    <div
                                        class="
                                            absolute left-0.5 top-0.5 w-5 h-5 bg-white
                                            rounded-full shadow-sm transition-transform duration-300
                                            peer-checked:translate-x-5
                                        "
                                    ></div>

                                </div>

                            </div>

                            <div class="grid grid-cols-2 gap-2" v-if="!justTags">
                                <button 
                                    @click="deleteNote(1)"
                                    class="w-full primary danger flex gap-1"
                                >
                                    <i class="bi bi-trash-fill" />
                                    Supprimer
                                </button>
                                <button
                                    @click="showShareMenu = true; emitClose()"
                                    class="w-full primary flex gap-1"
                                >
                                    <i class="bi bi-share-fill" />
                                    Partager
                                </button>
                            </div>

                            <hr class="-mx-4 text-gray-300" />

                            <div class="">
                                <button 
                                    class="w-full primary"
                                    @click="save"
                                >Sauvegarder</button>
                            </div>

                        </div>

                    </div>

                </div>
            
            </div>

        </transition>

        <Share_menu
            v-if="uuid"
            :uuid="uuid"
            v-model="showShareMenu"
        />

        <ConfirmDialog
            :visible="showConfirmDel"
            title="Supprimer vôtre note"
            message="êtes vous sur de vouloir supprimer votre note ?"
            @cancel="showConfirmDel = false"
            @confirm="deleteNote(2)"
        />

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
import Share_menu from '@/components/popup/share_menu.vue';
import ConfirmDialog from '@/components/popup/ConfirmDialog.vue';


const props = defineProps<{
    visible: Boolean;
    uuid?: string;
    justTags?: boolean;
    justView?: boolean;
    selectedTags?: number[];
}>();

const note = ref<Note | undefined | any>(undefined);
const showCard = ref<boolean>(false);
const showShareMenu = ref<boolean>(false);
const showConfirmDel = ref<boolean>(false);
const tags = ref<number[]>(props.selectedTags || []);

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
        await database.delete(props.uuid);
        Notes.value = Notes.value.filter(_note => _note.uuid !== props.uuid);
        emitClose();
    }
}

const save = () => {
    
    if (!note.value) return;

    if (props.justView) {
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
    
    if (props.justView) {
        note.value = {};
        tags.value = props.selectedTags || [];
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
