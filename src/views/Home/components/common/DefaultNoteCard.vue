<template>

    <PressAndHold
        @long-press="select_note"
        @click.stop="openNote"
    >
        <div
            class="
                group relative flex flex-col 
                rounded-2xl p-4 w-full h-[205px]
                cursor-pointer overflow-hidden
                hover:border-(--btn) border
                transition-all duration-200 ease-in-out
            "
            :class="[
                note_selected || isSelected(uuid)
                    ? 'border-(--btn) border-dashed border-2'
                    : 'border-gray-200', 
                inertw
            ]"
            :style="{ 
                'view-transition-name': `note-${uuid}`,
                background: bgColor
            }"
        >
            <div class="flex justify-between items-start mb-3 gap-2">
                <div class="flex items-center gap-2.5 min-w-0">
                    <img 
                        v-if="icon && icon != ''" 
                        :src="icon" 
                        class="w-6 h-6 object-contain shrink-0 opacity-80" 
                        loading="lazy"
                    />
                    <h2 
                        class="font-bold text-lg sm:text-xl "
                        v-text="title || 'Note sans titre'"
                    />
                </div>
            </div>

            <div class="text-xs sm:text-sm text-(--text)/80 leading-relaxed overflow-hidden">
                <p
                    v-if="IsPrivate"
                    class="font-mono text-[10px] tracking-widest opacity-50 line-clamp-3"
                >
                    {{ displayContent }}
                </p>
                <div
                    v-else
                    class="content-html line-clamp-3"
                    v-html="displayContent"
                ></div>
            </div>

            <div v-if="_Tags.length > 0" class="shrink-0 flex flex-wrap gap-1 mt-auto pt-2">
                <span
                    v-for="tag in _Tags"
                    :key="tag.id"
                    class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide"
                    :style="{ 
                        backgroundColor: tag.color + '20',
                        color: tag.color 
                    }"
                >
                    {{ tag.name }}
                </span>
            </div>

            <div 
                v-if="sharedBy && sharerIcon"
                class="shrink-0 gap-1 mt-2 flex flex-row justify-between items-center pt-2"
            >
                <img
                    class="w-7 h-7 rounded-full border border-gray-200"
                    :src="sharerIcon"
                    loading="lazy"
                />
                <div class="flex justify-center items-center flex-row -space-x-3">
                    <img
                        v-for="visitor in shareVisitors.slice(0, 5)"
                        :key="visitor.user_id"
                        class="w-7 h-7 rounded-full border border-gray-200 bg-white"
                        :src="visitor.imageUrl"
                        loading="lazy"
                    />
                    <div 
                        v-if="shareVisitors.length > 5"
                        class="flex items-center justify-center w-7 h-7 rounded-full border border-white bg-(--bg) text-[9px] font-bold z-10"
                    >
                        +{{ shareVisitors.length - 5 }}
                    </div>
                </div>
            </div>
        </div>
    </PressAndHold>

    <NoteParamsOverlay
        v-if="note_selected"
        v-model:visible="note_selected"
        :uuid="uuid"
        :selected-tags="tags"
    />
    
    <share_menu
        v-if="share_menu"
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
import { isSelected, toggleNoteSelect, selectedNotes } from '@/composables/useSelectedNotes';
import Share_menu from '@/components/popup/share_menu.vue';
import { getDominantColor } from '@/assets/ts/GetColorByImage'

const props = defineProps<{
    uuid: string;
    title: string;
    content: string;
    icon: string;
    tags: number[];
    click?: () => void;
    lines?: number;
    inertw?: string;
    sharedBy?: string;
}>();

const { getUserByUUID } = useUser();
const router = useRouter();

const bgColor = ref<string>('var(--white)');
const note_selected = ref<boolean>(false);
const share_menu = ref<boolean>(false);
const sharerIcon = ref<string | undefined>(undefined);
const shareVisitors = ref<User[]>([]);
const isMyShare = ref<boolean>(false);

const _Tags = computed<Tag[]>(() => Tags.value.filter(tag => props.tags.includes(tag.id)));

const displayContent = computed(() => {
    if (IsPrivate.value) {
        return utils.htmlToText(props.content).replace(/[a-zA-ZÀ-ÿ]/g, '█').slice(0, 500) + ' ...';
    }
    return utils.clean_html(props.content).slice(0, 500) + ' ...';
});

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

const addOpacityToHex = (hex: string, opacity: number) => {
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return `${hex}${alpha}`;
};

const select_note = () => {
    if (props.sharedBy) {
        if (isMyShare.value) share_menu.value = !share_menu.value;
        return;
    }
    if (isMobile) {
        toggleNoteSelect(props.uuid);
        return;
    }
    note_selected.value = !note_selected.value;
};

onMounted(async () => {

    if (props.sharedBy) {
        const _sharer = await getUserByUUID(props.sharedBy);
        sharerIcon.value = _sharer?.imageUrl;

        try {
            const token = await useToken();
            const res = await fetch(`${api_url}/api/share/${props.uuid}/info`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.share) {
                isMyShare.value = data.share.owner_id === window.localStorage.getItem('user_id');
                const visitors = data.share.visitor.slice(0, 6);
                for (const v of visitors) {
                    const u = await getUserByUUID(v);
                    if (u) shareVisitors.value.push(u);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (props.icon && props.icon !== '')
        bgColor.value = await getDominantColor(props.icon) + '22';

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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>