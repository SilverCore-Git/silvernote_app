<template>

    <PressAndHold
        @long-press="select_note"
        @click.stop="open_note(uuid)"
        class="h-full"
    >

        <div
            class="
                group relative flex flex-col
                bg-(--white)
                rounded-2xl p-4
                cursor-pointer overflow-hidden
                border border-gray-200
                hover:border-(--btn) 
                transition-all duration-200 ease-in-out
                max-h-40 w-full
            "
            :class="{ 'ring-1 ring-(--btn)': note_selected }"
        >
            
            <div class="flex justify-between items-start mb-3 gap-2">
                
                <div class="flex items-center gap-2.5 min-w-0">
                    <img 
                        v-if="icon && icon != ''" 
                        :src="icon" 
                        class="w-8 h-8 object-contain shrink-0 opacity-80" 
                    />
                    <h2 
                        class="font-bold text-lg sm:text-xl truncate leading-tight"
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

            <div class="text-xs sm:text-sm text-(--text)/80 leading-relaxed break-words ">
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

    <NoteParamsOverlay
        v-model:visible="note_selected"
        :uuid="uuid"
    />

</template>

<script lang="ts" setup>

import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import utils from '@/assets/ts/utils';
import type { Tag } from '@/assets/ts/type';
import { IsPrivate } from '@/assets/ts/settings/privatMode';
import PressAndHold from '@/components/PressAndHold.vue';
import NoteParamsOverlay from './NoteParamsOverlay.vue';

const props = defineProps<{
    uuid: string;
    title: string;
    content: string;
    icon: string;
    tags: number[]; // Liste des IDs des tags
    click?: () => void;
}>();

const router = useRouter();
const Tags = ref<Tag[]>([]);
const note_selected = ref<boolean>(false);

const open_note = (uuid: string) => {
  if (props.click) return props.click();
  router.push(`/edit/${uuid}`);
};

const select_note = () => {
  note_selected.value = !note_selected.value;
};


const loadTags = async () => {
  if (!props.tags || props.tags.length === 0) return;
  Tags.value = Tags.value.filter(tag => props.tags.includes(tag.id));
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



</style>