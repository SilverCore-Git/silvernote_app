<template>

    <teleport to="body">
        
        <Popup
            v-model:visible="props.active"
            @click.self="close"
        >
            
            <div
                @click.stop
                class="text-sm flex flex-col gap-6"
            >

                <div class="text-center">
                        
                    <h1 class="text-xl font-semibold mb-1">
                        Gérer les dossiers
                    </h1>

                    <p class="text-gray-600 dark:text-zinc-400 text-sm">
                        Sélectionnez les dossiers contenant la note.
                    </p>

                </div>

                <div 
                    class="
                        flex-1 overflow-y-auto max-h-[60vh] px-1 scrollbar-thin 
                        scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent
                        "
                    >
                        
                    <ul class="flex flex-col gap-4">

                        <li
                            v-for="(tag, index) in all_tags"
                            :key="index"
                            class="
                                
                                "
                        >

                            <label
                                class="
                                    flex items-center justify-between border rounded-xl cursor-pointer
                                    p-3 bg-[var(--bg2)]/80 hover:scale-102 transition select-none
                                "
                                :for="`switch-${tag.id}`"
                            >
                                
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-4 h-4 rounded-full border border-gray-400"
                                        :style="{ backgroundColor: tag.color || '#ccc' }"
                                    ></div>
                                    <span class="text-base font-medium text-gray-900 dark:text-zinc-100 truncate max-w-[150px]">
                                        {{ tag.name }}
                                    </span>
                                </div>

                                <div class="relative inline-flex items-center ">

                                    <input
                                        :id="`switch-${tag.id}`"
                                        type="checkbox"
                                        class="sr-only peer"
                                        :checked="tagsLocal.includes(tag.id)"
                                        @change="toggleTag(tag.id)"
                                    />

                                    <div
                                        class="
                                            w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 
                                            peer-focus:ring-[var(--btn)] rounded-full peer
                                            peer-checked:bg-[var(--btn)] transition-all
                                        "
                                    ></div>

                                    <div
                                        class="absolute left-[2px] top-[2px] w-5 h-5 bg-white
                                        rounded-full transition-transform peer-checked:translate-x-5"
                                    ></div>

                                </div>

                            </label>

                        </li>

                    </ul>

                </div>

                <div class="flex justify-end mt-4">

                    <button 
                        class="primary" 
                        @click="close"
                    >
                        Fermer
                    </button>

                </div>

            </div>

        </Popup>

    </teleport>

</template>



<script setup lang="ts">

import { onMounted, ref, watch, defineEmits, defineProps } from 'vue';

import db from '@/assets/ts/database/database';
import type { Tag } from '@/assets/ts/type';
import Popup from '../popup/Popup.vue';

const props = defineProps<{
    tags: number[];
    active: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:tags', value: number[]): void
    (e: 'update:active', value: boolean): void
}>()

const all_tags = ref<Tag[]>([]);
const tagsLocal = ref<number[]>([...props.tags]);

const toggleTag = (id: number) => {
    if (tagsLocal.value.includes(id)) {
        tagsLocal.value = tagsLocal.value.filter(t => t !== id);
    } else {
        tagsLocal.value.push(id);
    }
};

const close = () => {
    emit('update:tags', [...tagsLocal.value]);
    emit('update:active', false);
};

watch(() => props.active, (newVal) => {
    if (newVal) {
        tagsLocal.value = [...props.tags];
    }
});


onMounted(async () => {
    all_tags.value = await db.getAll('tags');
});

watch(all_tags, async () => {
    all_tags.value = await db.getAll('tags');
})

</script>

