<template>

    <PressAndHold
        @long-press="select_note"
        @click.stop.prevent="openNote"
    >

        <a :href="href" class="w-full h-full ">

            <div
                class="
                    group relative flex flex-raw gap-4 
                    justify-start items-start
                    rounded-2xl p-4 w-full h-[94px]
                    cursor-pointer overflow-hidden
                    hover:border-(--btn) border-2 
                    transition-all! duration-200 ease-in-out
                    backdrop-blur-3xl active:scale-95
                "
                :class="[
                    note_selected || isSelected(uuid)
                        ? 'border-(--btn) border-dashed '
                        : 'border-(--text)/40', 
                    inertw
                ]"
                :style="{ 
                    'view-transition-name': `note-${uuid}`,
                    'content-visibility': 'auto',
                    'contain-intrinsic-size': '1px 94px',
                    background: bgColor
                }"
                @mousemove="handleMouseMove"
            >
            
                <div 
                    v-if="icon && icon != ''" 
                    class="flex justify-center items-start"
                >
                    <img 
                        :src="icon" 
                        class="min-w-15 w-15 h-15 object-contain shrink-0 opacity-80" 
                        loading="lazy"
                    />
                </div>

                <div class="flex flex-col justify-between items-start gap-2 w-full ">

                    <h2 
                        class="font-bold text-xl sm:text-xl truncate text-ellipsis max-w-[92%]"
                        v-text="title || 'Note sans titre'"
                    />

                    <div v-if="_Tags.length > 0" class=" flex flex-raw gap-1 rounded-md max-w-[92%] overflow-hidden">
                        <span
                            v-for="tag in _Tags"
                            :key="tag.id"
                            class="
                                px-2 py-1 rounded-md text-[10px] 
                                font-bold uppercase tracking-wide 
                                bg-(--white)/50 border
                            "
                            :style="{
                                color: tag.color,
                                borderColor: tag.color
                            }"
                            :title="tag.name"
                        >
                            {{ tag.name }}
                        </span>
                    </div>

                </div>

                <div 
                    v-if="sharedBy && sharerIcon"
                    class="shrink-0 gap-1 mt-2 flex flex-row justify-between items-center pt-2"
                >
                    <div class="flex justify-center items-center flex-row -space-x-3">
                        <img
                            v-for="(visitor, index) in shareVisitors.slice(0, 5)"
                            :key="visitor.user_id"
                            class="w-7 h-7 rounded-full border border-gray-200 bg-white"
                            :style="{ zIndex: 10 - index }"
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
        
        </a>

    </PressAndHold>

    <NoteParamsOverlay
    v-if="false"
        v-model:visible="note_selected"
        :uuid="uuid"
        :selected-tags="tags"
    />

    <NoteCardDropdown
        v-model:visible="note_selected"
        :uuid="uuid"
        :x="client.x"
        :y="client.y"
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
import type { User, Tag } from '@/assets/ts/type';
import PressAndHold from '@/components/PressAndHold.vue';
import NoteParamsOverlay from './NoteParamsOverlay.vue';
import { Tags } from '@/assets/ts/database/Var';
import useUser from '@/composables/useUser';
import { api_url } from '@/assets/ts/backend_link';
import useToken from '@/composables/useToken';
import isMobile from '@/assets/ts/utils/isMobile';
import { isSelected, toggleNoteSelect, selectedNotes } from '@/composables/useSelectedNotes';
import Share_menu from '@/components/popup/share_menu.vue';
import NoteCardDropdown from './noteCardDropdown.vue';


const props = defineProps<{
    uuid: string;
    title: string;
    icon: string;
    tags: number[];
    click?: () => void;
    lines?: number;
    inertw?: string;
    sharedBy?: string;
    share?: any;
}>();


const { getUserByUUID } = useUser();
const router = useRouter();

const client = {
    x: 0,
    y: 0
};
const bgColor = computed(() => {
    const firstValidTag = Tags.value.find(tag => props.tags.includes(tag.id));
    return firstValidTag ? firstValidTag.color + '30' : 'rgba(var(--text-rgb), 0.05)';
});
const note_selected = ref<boolean>(false);
const share_menu = ref<boolean>(false);
const sharerIcon = ref<string | undefined>(undefined);
const shareVisitors = ref<User[]>([]);
const isMyShare = ref<boolean>(false);

const href = computed<string>(() => `/${props.sharedBy ? 'share' : 'edit'}/${props.uuid}`);
const _Tags = computed<Tag[]>(() => Tags.value.filter(tag => props.tags.includes(tag.id)));



const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    client.x = clientX;
    client.y = clientY;
};

const openNote = () => {
    if (selectedNotes.value.length > 0) {
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
    if (props.sharedBy)
    {
        if (isMyShare.value) share_menu.value = !share_menu.value;
        return;
    }
    if (isMobile) 
    {
        toggleNoteSelect(props.uuid);
        return;
    }

    note_selected.value = false;
    nextTick(() => note_selected.value = true);

};

const initShareVisitors = async () => {

    if (props.sharedBy) 
    {

        const initSharer = async () => {
            if (!props.sharedBy) return;
            const _sharer = await getUserByUUID(props.sharedBy);
            sharerIcon.value = _sharer?.imageUrl;
        }

        const initVisitors = async () => {

            let data: any;

            if (!props.share)
            {
                const token = await useToken();
                data = await fetch(`${api_url}/api/share/${props.uuid}/info`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json());
            
            }
            else data = { share: props.share };


            if (data.share) {

                isMyShare.value = data.share.owner_id === window.localStorage.getItem('user_id');

                data.share.visitor.push(data.share.owner_id);

                const visitorPromises = data.share.visitor
                                            //.filter((v: string) => v !== data.share.owner_id)
                                            .map((v: string) => getUserByUUID(v));
                                            
                const visitors = await Promise.all(visitorPromises);

                shareVisitors.value = visitors.filter(u => u !== null);

            }

        }

        try {

            await Promise.all([
                initSharer(),
                initVisitors()
            ])

        } 
        catch (e) {
            console.error(e);
        }

    }

}

onMounted(async () => {

    await initShareVisitors();

});

</script>

<style scoped>
.content-html :deep(h1), 
.content-html :deep(h2), 
.content-html :deep(h3) {
  font-size: 1.2em;
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