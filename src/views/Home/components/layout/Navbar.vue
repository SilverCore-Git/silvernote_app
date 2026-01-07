<template>

    <div
        class="
            h-screen bg-(--bg2) shadow-2xl
            p-4 min-w-65
        "
    >

        <ul class="w-full">
            
            <li class="flex-col phone-hidden-flex">

                <div class="flex flex-row gap-2 items-center justify-center">

                    <img src="/favicon.svg" class="w-8 rounded-md" />

                    <div class="flex flex-col items-start">
                        <span class="text-base font-bold">Silvernote</span>
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
                        :note-uuid="selectedNote"
                    />
                </div>
            </Transition>

            <div
                class="
                        flex flex-row justify-between items-center
                        w-full px-4 z-30 max-w-50 mx-auto
                    "
            >

                <a class="p-1.5" v-tooltip.bottom="'Paramètres'">
                    <div
                        class="
                                bi bi-gear text-(--btn) text-2xl 
                                w-7 h-7 flex justify-center items-center
                        "
                        @click="router.push('/settings')"
                    ></div>
                </a>

                <slot></slot>

                <a class="p-1.5 flex items-center justify-center ">
                    <UserButton
                        :appearance="{
                            elements: {
                                userButtonAvatarBox: {
                                    width: '24px',
                                    height: '24px'
                                }
                            }
                        }" 
                    />
                </a>

            </div>

            <div class="phone-hidden-flex flex-col gap-2">

                <hr class="mt-3 mb-4 text-gray-400 -mx-5" />

                <span class="text-xs text-(--text-little) uppercase font-semibold">Onglets</span>

                <li 
                    class="li"
                    @click="setFilter('all')"
                    :class="notes_filter == 'all' ? 'bg-[var(--btn)] text-white' : ''"
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
                    :class="notes_filter == 'pinned' ? 'bg-[var(--btn)] text-white' : ''"
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
                    :class="notes_filter == 'shared' ? 'bg-[var(--btn)] text-white' : ''"
                >
                    <i 
                        :class="notes_filter == 'shared' ? '' : 'text-[var(--btn)]'"
                        class="bi bi-people-fill text-xl"
                    />
                    <span>Notes partagées</span>
                </li>

                <hr class="my-2 text-transparent" />

                <span class="text-xs text-(--text-little) uppercase font-semibold">Affichage</span>

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

        </ul>

    </div>

</template>


<script lang="ts" setup>

import { useRoute, useRouter } from 'vue-router';
import { version, dev } from '../../../../../package.json';
import { notes_views_mode, toggle_notes_views_mode, notes_filter, type Notes_filter } from '@/assets/ts/Notes_views';
import { ref, watch } from 'vue';
import isMobile from '@/assets/ts/utils/isMobile';
import Navbar_note_settings from '@/components/notes/Navbar_note_settings.vue';
import { UserButton } from '@clerk/vue';


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

ul li {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

ul hr {
    opacity: 50%;
}

ul li:not(.nohover):hover {
  background-color: rgba(131, 131, 131, 0.15);
}

</style>