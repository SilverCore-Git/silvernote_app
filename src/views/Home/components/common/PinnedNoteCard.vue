<template>

    <PressAndHold
        @long-press="select_note()"
        @click.stop="open_note(id, true)"
        class="h-full"
    >

        <div
            class="
                group relative flex flex-col
                bg-[var(--white)]
                rounded-2xl p-4 shadow-lg
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

                <div v-if="Tags.length > 0" class="shrink-0">
                    <span 
                        class="
                            px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide
                            flex items-center justify-center
                        "
                        :style="{ 
                            backgroundColor: Tags[0].color + '20', /* 20 = ~12% opacité pour le fond pastel */
                            color: Tags[0].color 
                        }"
                    >
                        {{ Tags[0].name }}
                    </span>
                </div>
            </div>

            <div class="text-xs sm:text-sm text-[var(--text)]/80 leading-relaxed break-words">
                <p
                    v-if="IsPrivate"
                    class="line-clamp-3 font-mono text-[10px] tracking-widest opacity-50"
                >
                    {{ utils.htmlToText(content).replace(/[a-zA-ZÀ-ÿ]/g, '█').slice(0, 150) }}
                </p>

                <div
                    v-else
                    class="line-clamp-3 content-html"
                    v-html="utils.clean_html(content)"
                ></div>
            </div>

            <div v-if="Tags.length > 1" class="mt-2 flex gap-1">
                <div 
                    v-for="i in (Tags.length - 1)" 
                    :key="i" 
                    class="w-1.5 h-1.5 rounded-full"
                    :style="{ backgroundColor: Tags[i].color }"
                ></div>
            </div>

        </div>

    </PressAndHold>

</template>

<script lang="ts" setup>

import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import db from '@/assets/ts/database/database';
import utils from '@/assets/ts/utils';
import type { Tag } from '@/assets/ts/type';
import { IsPrivate } from '@/assets/ts/settings/privatMode';
import PressAndHold from '@/components/PressAndHold.vue';

const props = defineProps<{
  id: number;
  title: string;
  content: string;
  icon: string;
  tags: number[]; // Liste des IDs des tags
  click?: () => void;
}>();

const router = useRouter();
const Tags = ref<Tag[]>([]);
const note_selected = ref<boolean>(false); // Pour gérer l'état visuel de sélection

// --- Logique identique à NoteCard ---

const open_note = (id: number, pinned: boolean) => {
  if (props.click) return props.click();
  router.push(`/edit/${id}?pinned=${pinned}`);
};

const select_note = () => {
  // Logique de sélection (à adapter selon ton store ou event bus)
  note_selected.value = !note_selected.value;
  console.log("Note sélectionnée:", props.id);
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
/* Optimisation pour le rendu du HTML nettoyé 
   Permet d'éviter que des gros titres h1/h2 dans le contenu ne cassent la petite carte
*/
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

/* Gestion de l'ellipsis propre */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>