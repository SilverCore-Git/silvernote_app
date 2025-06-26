<template>

    <teleport to="body">

        <div
            v-if="props.active"
            class="fixed inset-0 z-50 flex items-center justify-center"
            style="background-color: #00000090; backdrop-filter: blur(3px);"
        >

            <div class="fixed inset-0 top-10 z-50 flex items-center justify-center px-4">

                <div
                    class="bg-[var(--bg2)] rounded-md p-4 m-3 mb-25 w-full max-w-sm text-sm flex flex-col items-center justify-center top"
                    style="border-radius: 15px;"
                >

                    <h1 class="text-2xl font-bold" style="font-family: 'Montserrat'; letter-spacing: 2px;">Gérer les dossiers</h1>
                    <span>Sélectionnez les dossiers contenant la note</span>

                    <ul class="flex flex-col items-center gap-5 w-full max-h-[60vh] overflow-auto pr-20 pl-20 mt-10">

                        <li
                            class="w-full"
                            v-for="(tag, index) in all_tags"
                            :key="index"
                        >

                            <label class="flex flex-row justify-between items-center" :for="`switch-${tag.id}`">

                                <span class="text-lg max-w-[60%]">{{ tag.name }}</span>

                                <div class="switch flex flex-row">
                                    
                                <input
                                    :id="`switch-${tag.id}`"
                                    type="checkbox"
                                    :checked="tagsLocal.includes(tag.id)"
                                    @change="toggleTag(tag.id)"
                                />

                                <span class="slider"></span>

                                </div>

                            </label>

                        </li>

                    </ul>

                    <button
                        class="second mt-8"
                        @click="close"
                    >
                        Fermer
                    </button>

                </div>

            </div>

        </div>

    </teleport>

</template>


<script setup lang="ts">

import { onMounted, ref, watch, defineEmits, defineProps } from 'vue';

import db from '../assets/ts/database';
import type { Tag } from '../assets/ts/type';

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

