<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { Notes } from '@/assets/ts/database/Var';
import { computed } from 'vue';
import DefaultNoteCard from '../common/DefaultNoteCard.vue';

const route = useRoute();
const router = useRouter();

const notes = computed(() => {

    const searchQuery = route.query.q ? String(route.query.q).toLowerCase().trim() : '';

    if (!searchQuery) return Notes.value;

    return Notes.value.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(searchQuery);
        const contentMatch = note.content.toLowerCase().includes(searchQuery);
        
        return titleMatch || contentMatch;
    });

});
</script>

<template>

    <div class="flex flex-col gap-4 relative h-full">

        <span class=" uppercase text-md font-semibold text-(--text-little) ">
            Notes filtrées ({{ notes.length }})
        </span>

        <ul v-if="notes.length" class="flex flex-wrap gap-4">
            <li
                v-for="(note, index) in notes"
                :key="index"
                @click="router.push('/edit/' + note.uuid)"
                class="w-[250px] cursor-pointer"
            >
                <DefaultNoteCard
                    :uuid="note.uuid"
                    :title="note.title"
                    :content="note.content"
                    :icon="note.icon"
                    :tags="note.tags"
                />
            </li>
        </ul>

        <div
            v-else
            class="flex flex-col justify-center items-center absolute inset-0 text-gray-400 -translate-y-20"
        >
            <i class="bi bi-search text-6xl mb-4 opacity-20"></i>
            <h3 class="text-2xl font-bold">Aucun résultat trouvé</h3>
            <p class="text-sm opacity-60">Aucune note ne correspond à "{{ route.query.q }}"</p>
        </div>

    </div>
    
</template>