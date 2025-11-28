<template>

    <Teleport to="body">

        <div class="fixed inset-0 flex justify-center items-center ">

            <div
                class="absolute inset-0 bg-black/30 backdrop-blur-sm z-20 pointer-events-none"
            />

            <div 
                class="
                    flex justify-center items-center flex-col
                    bg-(--bg2) border rounded-xl py-2 px-3
                    w-full max-w-2xl z-40
                "
            >

                <input
                    v-model="searchQuery"
                    type="text"
                    class="w-full border border-(--btn) rounded-md px-3 py-2 mb-3 outline-none"
                    placeholder="Recherche..."
                >

                <div class="w-full h-[50vh] overflow-y-auto">

                    <div
                        v-if="filteredNotes.length === 0"
                        class="text-center py-4"
                    >
                        Aucune note trouvée.
                    </div>

                    <div
                        v-for="note in filteredNotes"
                        :key="note.id"
                        @click="$emit('note', note.id)"
                        class="
                            p-3 mb-2 rounded-lg cursor-pointer
                            hover:bg-(--bg3) transition-colors border
                        "
                    >
                        <div class="font-semibold">{{ note.title || 'Note sans titre' }}</div>
                        <div class="text-sm opacity-70 truncate">{{ utils.htmlToText(note.content) }}</div>

                        <div class="flex flex-wrap gap-1 mt-2">
                            <span
                                v-for="tag in getTags(note)"
                                :key="tag.id"
                                :style="{ backgroundColor: tag.color }"
                                class="px-2 py-0.5 text-xs border rounded"
                            >
                                {{ tag.name }}
                            </span>
                        </div>
                    </div>

                </div>

            </div>

        </div>

    </Teleport>

</template>


<script lang="ts" setup>
import { Notes, Tags } from '@/assets/ts/database/Var';
import type { Note } from '@/assets/ts/type';
import { computed, ref, type Ref } from 'vue';
import utils from '@/assets/ts/utils';


const searchQuery = ref<string>('');

const emit = defineEmits<{
    (e: 'note', value: number): void;
}>()

const list_notes: Ref<Note[]> = Notes;

const filteredNotes = computed(() =>

    list_notes.value.filter(note => {
        const tagNames = Tags.value
        .filter(tag => note.tags.includes(tag.id))
        .map(tag => tag.name)
        .join(' ');

        const searchableText = [note.title, note.content, tagNames, ...(note.tags || [])]
        .join(' ')
        .toLowerCase();

        return searchableText.includes(searchQuery.value.toLowerCase());
    })

);

const getTags = (note: Note) =>
    Tags.value.filter(tag => note.tags.includes(tag.id));

</script>