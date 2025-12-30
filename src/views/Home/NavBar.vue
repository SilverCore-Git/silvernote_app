<template>

    <header 
        style="
            font-family: 'InterTight', sans-serif; 
            box-shadow: 0 0 15px #36363681;
        " 
        :style="{
            top: mobile.active ? mobile.margin.top : 0
        }"
        class="
                fixed 
                lg:inset-y-0 lg:left-0 inset-x-0
                text-2xl font-bold lg:w-60
                bg-[var(--bg2)] z-50 
                lg:p-4 py-1 p-0 my-4 lg:my-6 mx-6
                flex items-start justify-center dropdown
            "
    >

        <ul class="w-full">
            
            <li class="flex-col phone-hidden-flex">

                <div class="flex flex-row gap-2 items-center justify-center">

                    <img src="/favicon.svg" class="w-8 rounded-md" />

                    <div class="flex flex-col items-start">
                        <span class="text-base">Silvernote</span>
                        <span class="text-[var(--text-little)] text-[10px] -mt-1">
                            version {{ version }}
                        </span>
                    </div>

                </div>

                <span 
                    v-if="dev" 
                    class="text-sm text-[var(--btn)]" 
                    style="letter-spacing: 0.2px;"
                >
                    Development mode
                </span>

            </li>

            <Transition name="fade-slide">
                <div
                    v-if="selectedNote !== '' && isMobile"
                    class="
                            flex flex-row justify-between items-center rounded-2xl
                            w-full px-4 text-3xl absolute bg-(--bg2) z-35"
                >
                    <Navbar_note_settings
                        @close="closeNoteSettings"
                        :reload_func="reload_func"
                        :note-uuid="selectedNote"
                    />
                </div>
            </Transition>

            <Transition name="fade-slide">
                <div
                    class="
                            flex flex-row justify-between items-center
                            w-full px-4 z-30
                        "
                >

                    <a class="p-1.5" v-tooltip.bottom="'Paramètres'">
                        <div
                            class="gear-svg
                                    w-7
                                    h-7
                                "
                            @click="router.push('/settings')"
                        ></div>
                    </a>

                    <slot></slot>

                    <a class="p-1.5 flex items-center justify-center ">
                        <!-- <UserButton 
                            :appearance="{
                                elements: {
                                    userButtonAvatarBox: {
                                        width: '24px',
                                        height: '24px'
                                    }
                                }
                            }" 
                        /> -->
                        <UserAvatarButton />
                    </a>

                </div>
            </Transition>

            <div class="phone-hidden-flex flex-col gap-2">

                <hr class="mt-3 mb-4" />

                <span class="text-xs text-[var(--text-little)]">Trier par</span>

                <li 
                    class="li"
                    @click="setFilter('all')"
                    :class="notes_filter == 'all' ? 'bg-[var(--btn)]' : ''"
                >
                    <i 
                        :class="notes_filter == 'all' ? '' : 'text-[var(--btn)]'"
                        class="bi bi-journal-text text-xl"
                    />
                    <span>Toutes les notes</span>
                </li>

                <li 
                    class="li"
                    @click="setFilter('pinned')"
                    :class="notes_filter == 'pinned' ? 'bg-[var(--btn)]' : ''"
                >
                    <i 
                        :class="notes_filter == 'pinned' ? '' : 'text-[var(--btn)]'"
                        class="bi bi-pin-angle-fill text-xl"
                    />
                    <span>Notes epinglé</span>
                </li>

                <li 
                    class="li"
                    @click="setFilter('shared')"
                    :class="notes_filter == 'shared' ? 'bg-[var(--btn)]' : ''"
                >
                    <i 
                        :class="notes_filter == 'shared' ? '' : 'text-[var(--btn)]'"
                        class="bi bi-people-fill text-xl"
                    />
                    <span>Notes partagées</span>
                </li>

                <hr class="my-2 text-transparent" />

                <span class="text-xs text-[var(--text-little)]">Affichage</span>

                <li 
                    @click.stop="toggle_notes_views_mode()" 
                    class="li nohover2"
                >
                    <i 
                        class="bi text-[var(--btn)] text-xl"
                        :class="notes_views_mode === 'default' ? 'bi-grid' : 'bi-grid-3x3-gap-fill'"
                    />
                    <span>Organiser par {{ notes_views_mode == "default" ? 'tags' : 'épinglé' }} </span>
                </li>

            </div>

            <div 
                v-if="false"
                class="absolute bottom-3.5 inset-x-5 phone-hidden"
            >
                <New_note_btn @btn_click="newNote"  />
            </div>

        </ul>

    </header>

</template>

<script lang="ts" setup>

import { useRoute, useRouter } from 'vue-router';
import { version, dev } from '../../../package.json';
import { notes_views_mode, toggle_notes_views_mode, notes_filter, type Notes_filter } from '@/assets/ts/Notes_views';
import New_note_btn from './New_note_btn.vue';
import mobile from  '@/configs/mobile.json';
import { ref, watch } from 'vue';
import isMobile from '@/assets/ts/utils/isMobile';
import Navbar_note_settings from '@/components/notes/Navbar_note_settings.vue';
import UserAvatarButton from '@/components/user/UserAvatarButton.vue';

defineProps<{
    reload_func: (a?: 'just_view' | 'local') => Promise<void>;
}>()

const router = useRouter();
const route = useRoute();
const selectedNote = ref<string>('');

const setFilter = (a: Notes_filter): void => {
    notes_filter.value = a;
}

const newNote = () => {
    router.push('/edit/new');
}

watch(() => route.query.selectedNote, () => {
    if (!route.query.selectedNote) return selectedNote.value = '';
    selectedNote.value = String(route.query.selectedNote);
})

const closeNoteSettings = () => {
    router.push({
        query: {
            ...route.query,
            selectedNote: undefined
        }
    });
}

</script>

<style scoped>

.ellipsis-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/assets/svgs/ellipsis.svg');
    transition: all 0.3s ease;
}

.li {
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
    transition: all 0.3s;
    :where(& > :not(:last-child)) {
        --tw-space-x-reverse: 0;
        margin-inline-start: calc(calc(var(--spacing) * 2) /* 0.5rem = 8px */ * var(--tw-space-x-reverse));
        margin-inline-end: calc(calc(var(--spacing) * 2) /* 0.5rem = 8px */ * calc(1 - var(--tw-space-x-reverse)));
    };
}

.li:not(.nohover2):hover {
    padding-left: 1.5em;
}

.nav-svg {
    width: 3vw;
    height: 3vw;
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 10px;
}

.gear-svg {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../assets/svgs/gear.svg');
    filter: brightness(0) saturate(100%) invert(61%) sepia(43%) saturate(1182%) hue-rotate(343deg) brightness(99%) contrast(92%);
}

.grid-svg {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../assets/svgs/grid.svg');
}

.grid2-svg {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../../assets/svgs/grid2.svg');
}


</style>