<template>

    <PressAndHold
        @long-press="select_note"
        @click.stop.prevent="open_note"
        class="h-full"
    >

        <a :href="href" class="w-full h-full">

            <div
                class="
                    group relative flex flex-col 
                    rounded-2xl p-4 w-full h-[94px]
                    cursor-pointer overflow-hidden
                    hover:border-(--btn) border hover:scale-101
                    transition-all! duration-200 ease-in-out
                    backdrop-blur-3xl active:scale-90
                "
                :class="
                    note_selected || isSelected(props.uuid)
                        ? 'border-(--btn) border-dashed border-2'
                        : 'border-gray-200'
                "
                :style="{ 
                    'view-transition-name': `note-${uuid}`,
                    'content-visibility': 'auto',
                    'contain-intrinsic-size': '1px 94px',
                    background: bgColor
                }"
            >
                
                <div class="flex justify-between items-start mb-3 gap-2">
                    
                    <div class="flex items-center gap-2.5 min-w-0">
                        <img 
                            v-if="icon && icon != ''" 
                            :src="icon" 
                            class="w-8 h-8 object-contain shrink-0 opacity-80" 
                        />
                        <h2 
                            class="font-bold text-xl sm:text-2xl"
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

                <div v-if="_Tags.length > 1" class="mt-2 flex gap-1">
                    <div 
                        v-for="i in (_Tags.length - 1)" 
                        :key="i" 
                        class="w-1.5 h-1.5 rounded-full"
                        :style="{ backgroundColor: _Tags[i].color }"
                    ></div>
                </div>

            </div>

        </a>

    </PressAndHold>

    <NoteParamsOverlay
        v-model:visible="note_selected"
        :selected-tags="tags"
        :uuid="uuid"
    />

</template>

<script lang="ts" setup>

import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Tag } from '@/assets/ts/type';
import PressAndHold from '@/components/PressAndHold.vue';
import NoteParamsOverlay from './NoteParamsOverlay.vue';
import { Tags } from '@/assets/ts/database/Var';
import isMobile from '@/assets/ts/utils/isMobile';
import { isSelected, selectedNotes, toggleNoteSelect } from '@/composables/useSelectedNotes';


const props = defineProps<{
    uuid: string;
    title: string;
    icon: string;
    tags: number[]; // Liste des IDs des tags
    click?: () => void;
}>();

const bgColor = ref<string>('var(--white)');
const router = useRouter();
const _Tags = computed<Tag[]>(() => Tags.value.filter(tag => props.tags.includes(tag.id)));
const note_selected = ref<boolean>(false);
const href = computed<string>(() => `/edit/${props.uuid}`);


const open_note = () => {
    if (isMobile && selectedNotes.value.length > 0) {
        toggleNoteSelect(props.uuid);
        return;
    }
    if (props.click) return props.click();

    if (!document.startViewTransition) {
        router.push(href.value);
        return;
    }

    document.startViewTransition(async () => {
        await router.push(href.value);
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

onMounted(async () => {
    
    if (props.tags[0])
    {
        const firstValidTag = Tags.value.find(tag => props.tags.includes(tag.id));
        bgColor.value = firstValidTag?.color + '30' || 'var(--white)';
    }

})

</script>

<style scoped>


.content-html :deep(h1), 
.content-html :deep(h2), 
.content-html :deep(h3) {
  font-size: 1em;
  font-weight: bold;
  display: inline;
}

.line-clamp-6 {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

</style>