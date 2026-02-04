<template>

    <PressAndHold
        @long-press="select_note"
        @click.stop="open_note"
        class="h-full"
    >

        <div
            class="
                group relative flex flex-col
                bg-(--white)
                rounded-2xl p-4
                cursor-pointer overflow-hidden 
                hover:border-(--btn) border
                transition-all duration-200 ease-in-out
                w-full
            "
            :class="
                note_selected || isSelected(props.uuid)
                    ? 'border-(--btn) border-dashed border-2'
                    : 'border-gray-200'
            "
            :style="{ 'view-transition-name': `note-${uuid}` }"
        >
            
            <div class="flex justify-between items-start mb-3 gap-2">
                
                <div class="flex items-center gap-2.5 min-w-0">
                    <img 
                        v-if="icon && icon != ''" 
                        :src="icon" 
                        class="w-8 h-8 object-contain shrink-0 opacity-80" 
                    />
                    <h2 
                        class="font-bold text-lg sm:text-xl"
                        v-text="title.length > 0 ? title : 'Note sans titre'"
                    />
                </div>

                <div v-if="_Tags.length > 0" class="shrink-0">
                    <span 
                        class="
                            px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide
                            flex items-center justify-center
                        "
                        :style="{ 
                            backgroundColor: _Tags[0].color + '20', /* 20 = ~12% opacité pour le fond pastel */
                            color: _Tags[0].color 
                        }"
                    >
                        {{ _Tags[0].name }}
                    </span>
                </div>
            </div>

            <div class="text-xs sm:text-sm text-(--text)/80 leading-relaxed break-words max-h-30">
                <p
                    v-if="IsPrivate"
                    class="line-clamp-3 font-mono text-[10px] tracking-widest opacity-50"
                >
                    {{ utils.htmlToText(content).replace(/[a-zA-ZÀ-ÿ]/g, '█').slice(0, 500) + ' ...' }}
                </p>

                <div
                    v-else
                    class="line-clamp-3 content-html"
                    v-html="utils.clean_html(content).slice(0, 500) + ' ...'"
                ></div>
            </div>

            <div v-if="_Tags.length > 1" class="mt-2 flex gap-1">
                <div 
                    v-for="i in (_Tags.length - 1)" 
                    :key="i" 
                    class="w-1.5 h-1.5 rounded-full"
                    :style="{ backgroundColor: _Tags[i].color }"
                ></div>
            </div>

        </div>

    </PressAndHold>

    <NoteParamsOverlay
        v-model:visible="note_selected"
        :selected-tags="tags"
        :uuid="uuid"
    />

</template>

<script lang="ts" setup>

import { computed, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import utils from '@/assets/ts/utils';
import type { Tag } from '@/assets/ts/type';
import { IsPrivate } from '@/assets/ts/settings/privatMode';
import PressAndHold from '@/components/PressAndHold.vue';
import NoteParamsOverlay from './NoteParamsOverlay.vue';
import { Tags } from '@/assets/ts/database/Var';
import isMobile from '@/assets/ts/utils/isMobile';
import { isSelected, selectedNotes, toggleNoteSelect } from '@/composables/useSelectedNotes';

const props = defineProps<{
    uuid: string;
    title: string;
    content: string;
    icon: string;
    tags: number[]; // Liste des IDs des tags
    click?: () => void;
}>();

const router = useRouter();
const _Tags = computed<Tag[]>(() => Tags.value.filter(tag => props.tags.includes(tag.id)));
const note_selected = ref<boolean>(false);

const open_note = () => {
    if (isMobile && selectedNotes.value.length > 0) {
        toggleNoteSelect(props.uuid);
        return;
    }
    if (props.click) return props.click();

    if (!document.startViewTransition) {
        router.push(`/edit/${props.uuid}`);
        return;
    }

    document.startViewTransition(async () => {
        await router.push(`/edit/${props.uuid}`);
        await nextTick(); 
    });

};

const select_note = () => {
    if (isMobile)
    {
        toggleNoteSelect(props.uuid);
        return;
    }
    note_selected.value = !note_selected.value;
};


</script>

<style scoped>


.content-html :deep(h1), 
.content-html :deep(h2), 
.content-html :deep(h3) {
  font-size: 1em;
  font-weight: bold;
  display: inline;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}



</style>