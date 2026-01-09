<template>

    <PressAndHold
        @long-press="select_note"
        @click.stop="open_note(id, true)"
        class="h-full"
    >

        <div
            class="
                group relative flex flex-col
                bg-[var(--white)]
                rounded-2xl p-4 
                cursor-pointer overflow-hidden h-full
                border border-gray-200
                hover:border-(--btn)
                transition-all duration-200 ease-in-out
            "
            :class="{ 'ring-1 ring-[var(--btn)]': note_selected }"
        >
            
            <div class="flex justify-between items-start mb-3 gap-2">
                
                <div class="flex items-center gap-2.5 min-w-0">
                    <img 
                        v-if="icon && icon != ''" 
                        :src="icon" 
                        class="w-5 h-5 object-contain shrink-0 opacity-80" 
                    />
                    <h2 
                        class="font-bold text-sm sm:text-base truncate leading-tight"
                        v-html="utils.clean_html(title)"
                    ></h2>
                </div>

            </div>

            <div class="text-xs sm:text-sm text-[var(--text)]/80 leading-relaxed break-words">
                <p
                    v-if="IsPrivate"
                    class=" font-mono text-[10px] tracking-widest opacity-50"
                    :class="lines ? `line-clamp-${lines}` : 'line-clamp-3'"
                >
                    {{ utils.htmlToText(content).replace(/[a-zA-ZÀ-ÿ]/g, '█').slice(0, 150) }}
                </p>

                <div
                    v-else
                    class=" content-html"
                    :class="lines ? `line-clamp-${lines}` : 'line-clamp-3'"
                    v-html="utils.clean_html(content)"
                ></div>
            </div>

            <div v-if="Tags.length > 0" class="shrink-0 flex flex-wrap gap-1 mt-2">
                <span
                    v-for="tag in Tags"
                    class="
                        px-2 py-1 rounded-md text-[10px] font-bold uppercase
                        flex items-center justify-center tracking-wide
                    "
                    :style="{ 
                        backgroundColor: tag.color + '20', /* 20 = ~12% opacité pour le fond pastel */
                        color: tag.color 
                    }"
                >
                    {{ tag.name }}
                </span>
            </div>
            
        </div>

    </PressAndHold>

    <NoteParamsOverlay
        v-model:visible="note_selected"
        :id="id"
    />

</template>

<script lang="ts" setup>

import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import db from '@/assets/ts/database/database';
import utils from '@/assets/ts/utils';
import type { Tag } from '@/assets/ts/type';
import { IsPrivate } from '@/assets/ts/settings/privatMode';
import PressAndHold from '@/components/PressAndHold.vue';
import NoteParamsOverlay from '@/components/common/NoteParamsOverlay.vue';

const props = defineProps<{
    id: number;
    title: string;
    content: string;
    icon: string;
    tags: number[]; // Liste des IDs des tags
    click?: () => void;
    lines?: 3 | 4 | 5 | 6 | 7 | 8;
}>();

const router = useRouter();
const Tags = ref<Tag[]>([]);
const note_selected = ref<boolean>(false);


// --- Logique identique à NoteCard ---

const open_note = (id: number, pinned: boolean) => {
  if (props.click) return props.click();
  router.push(`/edit/${id}?pinned=${pinned}`);
};

const select_note = () => {
  note_selected.value = !note_selected.value;
};

// Chargement des tags depuis la DB (IndexDB)
const loadTags = async () => {
  if (!props.tags || props.tags.length === 0) return;
  const all_tags = await db.getAll('tags');
  // On récupère les objets Tag complets qui correspondent aux IDs
  Tags.value = all_tags.filter(tag => props.tags.includes(tag.id));
};

onMounted(() => {
  loadTags();
});

watch(() => props.tags, () => {
  loadTags();
});

</script>

<style scoped>

.content-html :deep(h1), 
.content-html :deep(h2), 
.content-html :deep(h3) {
  font-size: 1em;
  font-weight: bold;
  display: inline;
}

.content-html :deep(p) {
  display: inline;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-5 {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-6 {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-7 {
  display: -webkit-box;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-8 {
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>