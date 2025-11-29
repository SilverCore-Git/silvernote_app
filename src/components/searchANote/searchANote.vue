<template>

    <Teleport to="body">

        <div class="fixed inset-0 flex justify-center items-center z-60">

            <div
                @click.stop="close"
                class="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            <Transition name="fade-slide">

                <div 
                    class="
                        flex justify-center items-center flex-col
                        bg-(--bg2) border rounded-xl p-3
                        w-full max-w-2xl z-70
                    "
                    v-if="display"
                >

                    <input
                        @focus="isFocus = true"
                        @blur="isFocus = false"
                        v-model="searchQuery"
                        ref="input"
                        type="text"
                        class="w-full border rounded-md px-3 py-2 mb-3 outline-none"
                        :class="isFocus ? 'border-(--btn)' : ''"
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

            </Transition>

        </div>

    </Teleport>

</template>


<script lang="ts" setup>

import { Notes, Tags } from '@/assets/ts/database/Var';
import type { Note } from '@/assets/ts/type';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
import utils from '@/assets/ts/utils';

const display = ref<boolean>(false);
const searchQuery = ref<string>('');
const isFocus = ref<boolean>(false);
const input = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
    (e: 'note', value: number): void;
    (e: 'close'): void;
}>()

const list_notes: Ref<Note[]> = Notes;

const filteredNotes = computed(() =>
    list_notes.value.filter(note => {
        const tagNames = Tags.value
            .filter(tag => note.tags.includes(tag.id))
            .map(tag => tag.name)
            .join(' ');

        const searchableText = [
            note.title || '',
            note.content || '',
            tagNames
        ]
        .join(' ')
        .toLowerCase();

        return searchableText.includes(searchQuery.value.toLowerCase());
    })
);

const getTags = (note: Note) =>
    Tags.value.filter(tag => note.tags.includes(tag.id));

onMounted(async () => {
    display.value = true;
    await nextTick();
    input.value?.focus();
});

onBeforeUnmount(() => {
    setTimeout(() => {
        display.value = false;
    }, 100);
});

const close = () => {
    display.value = false;
    setTimeout(() => {
        emit('close');
    }, 100);
}

</script>