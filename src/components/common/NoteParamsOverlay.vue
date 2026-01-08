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

                        <PinnedNoteCard
                            v-if="note"
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
                                p-6 w-full text-sm h-full
                                border border-[#F28C28]/60 relative
                            "
                        >
                    
                            <a
                                class="absolute top-6 right-6 h-8 w-8 z-100"
                                @click="emitClose"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </a>

                            <h3 class="text-xl font-semibold">
                                Paramettres de la note
                            </h3>

                        </div>

                    </div>

                </div>
            
            </div>

        </transition>

    </Teleport>

</template>

<script setup lang="ts">

import BackdropOverlay from '../common/BackdropOverlay.vue';
import type { Note } from '@/assets/ts/type';
import { onMounted, ref } from 'vue';
import { Notes } from '@/assets/ts/database/Var';
import PinnedNoteCard from '@/views/Home/components/common/PinnedNoteCard.vue';


const props = defineProps<{
    visible: Boolean,
    id: number
}>();

const note = ref<Note | undefined>(undefined);

const emit = defineEmits(['update:visible']);

const emitClose = () => {
  emit('update:visible', false);
};


onMounted(() => {
    note.value = Notes.value.find(note => note.id === props.id);
})

</script>
