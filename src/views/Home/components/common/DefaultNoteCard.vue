<template>

    <PressAndHold
        @long-press="select_note"
        @click.stop="openNote"
    >

        <div
            class="
                group relative flex flex-col
                bg-(--white) w-full
                rounded-2xl p-4 
                cursor-pointer overflow-hidden
                hover:border-(--btn) border
                transition-all duration-200 ease-in-out
                h-full max-h-40
            "
            :class="[
                note_selected || isSelected(uuid)
                    ? 'border-(--btn) border-dashed border-2'
                    : 'border-gray-200', 
                inertw
            ]"
            :style="{ 'view-transition-name': `note-${uuid}` }"
        >
            
            <div class="flex justify-between items-start mb-3 gap-2">
                
                <div class="flex items-center gap-2.5 min-w-0">
                    <img 
                        v-if="icon && icon != ''" 
                        :src="icon" 
                        class="w-5 h-5 object-contain shrink-0 opacity-80" 
                    />
                    <h2 
                        class="font-bold text-base sm:text-lg"
                        v-text="title"
                    />
                </div>

            </div>

            <div class="text-xs sm:text-sm text-(--text)/80 leading-relaxed wrap-break-word">
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

            <div v-if="_Tags.length > 0" class="shrink-0 flex flex-wrap gap-1 mt-2">
                <span
                    v-for="tag in _Tags"
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

            <div 
                v-if="sharedBy && sharerIcon"
                class="
                    shrink-0 gap-1 mt-2
                    flex flex-raw
                    justify-between items-center
                "
            >

                <img
                    class="w-8 h-8 rounded-full border border-gray-200"
                    :src="sharerIcon"
                />

                <div class="flex justify-center items-center flex-row -space-x-3">

                    <img
                        v-for="visitor in shareVisitors.slice(0, 5)"
                        :key="visitor.user_id"
                        class="w-8 h-8  rounded-full border border-gray-200"
                        :src="visitor.imageUrl"
                        :title="visitor.username"
                    />

                    <div 
                        v-if="shareVisitors.length > 5"
                        class="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-(--bg) text-[10px] font-bold shadow-sm z-10"
                    >
                        +{{ shareVisitors.length - 5 }}
                    </div>

                </div>

            </div>
            
        </div>

    </PressAndHold>

    <NoteParamsOverlay
        v-model:visible="note_selected"
        :uuid="uuid"
    />

    <share_menu
        :uuid="uuid"
        :title="title"
        v-model="share_menu"
    />

</template>

<script lang="ts" setup>

import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import utils from '@/assets/ts/utils';
import type { User, Tag } from '@/assets/ts/type';
import { IsPrivate } from '@/assets/ts/settings/privatMode';
import PressAndHold from '@/components/PressAndHold.vue';
import NoteParamsOverlay from './NoteParamsOverlay.vue';
import { Tags } from '@/assets/ts/database/Var';
import useUser from '@/composables/useUser';
import { api_url } from '@/assets/ts/backend_link';
import useToken from '@/composables/useToken';
import isMobile from '@/assets/ts/utils/isMobile';
import { isSelected, selectedNotes, toggleNoteSelect } from '@/composables/useSelectedNotes';
import Share_menu from '@/components/popup/share_menu.vue';

const props = defineProps<{
    uuid: string;
    title: string;
    content: string;
    icon: string;
    tags: number[]; // Liste des IDs des tags
    click?: () => void;
    lines?: 3 | 4 | 5 | 6 | 7 | 8;
    inertw?: string;
    sharedBy?: string;
}>();


const { getUserByUUID } = useUser();
const router = useRouter();
const _Tags = computed<Tag[]>(() => Tags.value.filter(tag => props.tags.includes(tag.id)));
const note_selected = ref<boolean>(false);
const sharerIcon = ref<string | undefined>(undefined);
const shareVisitors = ref<User[]>([]);
const share_menu = ref<boolean>(false);
const isMyShare = ref<boolean>(false);



const openNote = () => {
    if (isMobile && selectedNotes.value.length > 0) {
        toggleNoteSelect(props.uuid);
        return;
    }
    if (props.click) return props.click();

    if (!document.startViewTransition) {
        router.push(`/${props.sharedBy ? 'share' : 'edit'}/${props.uuid}`);
        return;
    }

    document.startViewTransition(async () => {
        await router.push(`/${props.sharedBy ? 'share' : 'edit'}/${props.uuid}`);
        await nextTick(); 
    });
};

const select_note = () => {
    if (props.sharedBy && isMyShare.value)
    {
        share_menu.value = !share_menu.value;
        return;
    }
    else if (props.sharedBy && !isMyShare.value)
    {
        return;
    }
    if (isMobile)
    {
        toggleNoteSelect(props.uuid);
        return;
    }
    note_selected.value = !note_selected.value;
};

onMounted(async () => {

    if (props.sharedBy)
    {

        const _sharer = await getUserByUUID(props.sharedBy)
        sharerIcon.value = _sharer?.imageUrl;

        const shareData = await fetch(`${api_url}/api/share/${props.uuid}/info`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await useToken()}`
            }
        }).then(res => res.json()).then(res => res.share);

        const visitors = shareData.visitor;
        isMyShare.value = shareData.owner_id === window.localStorage.getItem('user_id');
        
        for (const visitor of visitors)
        {
            if (shareVisitors.value.length >= 5) break;
            const user = await getUserByUUID(visitor);
            
            shareVisitors.value.push(user);
        
        }

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