<template>

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
                class="fixed inset-0 flex justify-center items-center z-100 pointer-events-none"
            >

                <div
                    class="
                        max-w-2xl max-h-100
                        grid grid-cols-[280px_1em_300px]
                        w-full h-full gap-10
                        pointer-events-auto
                    "
                >

                    <div class="w-full">

                        <DefaultNoteCard
                            v-if="note && showCard"
                            :id="note.id"
                            :title="note.title"
                            :content="note.content"
                            :icon="note.icon"
                            :tags="note.tags"
                            :lines="8"
                        />

                    </div>

                    <div
                        class="
                            gap-2 mx-auto w-full
                            flex flex-col justify-center items-center
                            text-4xl text-(--white) font-black
                        "
                    >
                        <i class="bi bi-arrow-right" />
                        <i class="bi bi-arrow-left" />
                    </div>

                    <div class="w-full">

                        <div
                            class="
                                bg-[var(--white)] rounded-2xl shadow-xl
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
                                Paramettres de la note
                            </h3>

                            <div class="w-full ">

                                <span class="text-xs text-(--text-little) uppercase font-semibold">
                                    Tags
                                </span>

                                <ul class="flex flex-col gap-2 h-40 overflow-y-auto w-full px-2 overflow-x-hidden">

                                    <li
                                        v-if="Tags.length > 0"
                                        v-for="(tag, index) in Tags"
                                        :key="index"
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
                                                    :checked="note?.tags.includes(tag.id)"
                                                    @change="toggleTag(tag.id)"
                                                />

                                                <div
                                                    class="
                                                        w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 
                                                        peer-focus:ring-(--btn) rounded-full peer
                                                        peer-checked:bg-(--btn) transition-all
                                                    "
                                                ></div>

                                                <div
                                                    class="absolute left-[2px] top-[2px] w-5 h-5 bg-white
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
                                class="
                                    group flex items-center justify-between 
                                    border rounded-xl cursor-pointer p-4 
                                    transition-all duration-200 ease-out
                                    select-none
                                "
                                :class="note?.pinned 
                                    ? 'bg-[var(--btn)]/10 border-[var(--btn)] shadow-[var(--btn)]/20 shadow-sm' 
                                    : 'bg-[var(--bg)]/50 border-gray-200 hover:border-[var(--btn)] hover:bg-[var(--bg)]'
                                "
                                @click.stop="togglePin()"
                            >
                                
                                <div class="flex items-center gap-3">
                                    
                                    <div 
                                        class="
                                            w-8 h-8 rounded-full flex items-center justify-center
                                            transition-colors duration-300
                                        "
                                        :class="note?.pinned ? 'bg-[var(--btn)] text-white' : 'bg-gray-100 text-gray-400 group-hover:text-[var(--btn)]'"
                                    >
                                        <i class="bi" :class="note?.pinned ? 'bi-pin-fill' : 'bi-pin'" />
                                    </div>

                                    <div class="flex flex-col">
                                        <span class="text-sm font-bold text-[var(--text)]">
                                            {{ note?.pinned ? 'Note épinglée' : 'Épingler la note' }}
                                        </span>
                                        <span class="text-[10px] text-[var(--text-little)]">
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
                                            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--btn)]/50 
                                            rounded-full peer 
                                            peer-checked:bg-[var(--btn)]
                                            transition-colors duration-300
                                        "
                                    ></div>

                                    <div
                                        class="
                                            absolute left-[2px] top-[2px] w-5 h-5 bg-white
                                            rounded-full shadow-sm transition-transform duration-300
                                            peer-checked:translate-x-5
                                        "
                                    ></div>

                                </div>

                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <button class="w-full primary danger flex gap-1">
                                    <i class="bi bi-trash-fill" />
                                    Supprimer
                                </button>
                                <button class="w-full primary flex gap-1">
                                    <i class="bi bi-share-fill" />
                                    Partager
                                </button>
                            </div>

                            <hr class="-mx-4 text-gray-300" />

                            <div class="grid grid-cols-2 gap-2">
                                <button class="w-full primary danger" @click="emitClose">Annuler</button>
                                <button class="w-full primary" @click="save">Sauvegarder</button>
                            </div>

                        </div>

                    </div>

                </div>
            
            </div>

        </transition>

    </Teleport>

</template>

<script setup lang="ts">

import BackdropOverlay from '@/components/common/BackdropOverlay.vue';
import type { Note } from '@/assets/ts/type';
import { nextTick, ref, watch } from 'vue';
import { Notes, Tags } from '@/assets/ts/database/Var';
import DefaultNoteCard from '@/views/Home/components/common/DefaultNoteCard.vue';
import database from '@/assets/ts/database/database';


const props = defineProps<{
    visible: Boolean,
    id: number
}>();

const note = ref<Note | undefined>(undefined);
const showCard = ref<boolean>(false);

const emit = defineEmits(['update:visible']);

const emitClose = () => {
  emit('update:visible', false);
};

const save = () => {
    if (!note.value) return;

    const index = Notes.value.findIndex(n => n.id === props.id);

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
    const _note = Notes.value.find(note => note.id === props.id);
    note.value = JSON.parse(JSON.stringify(_note));
    showCard.value = true;
}

watch(() => props.visible, () => {
    if (props.visible) mount()
})


</script>
