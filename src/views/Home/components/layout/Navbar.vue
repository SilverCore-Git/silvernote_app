<template>

    <div
        class="
            h-full bg-(--bg2) shadow-2xl
            p-4 min-w-65 relative
        "
    >

        <ul class="w-full">
            
            <li class="flex-col">

                <div class="flex flex-row gap-2 items-center justify-center">

                    <img src="/favicon.svg" class="w-8 rounded-md" />

                    <div class="flex flex-col items-start">
                        <span class="text-base font-bold">Silvernote</span>
                        <span class="text(--text-little) text-[10px] -mt-1">
                            version {{ version }}
                        </span>
                    </div>

                </div>

                <span 
                    v-if="dev" 
                    class="text-sm text-(--btn)" 
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
                        my-2
                        flex flex-row justify-between items-center
                        w-full px-4 z-30 max-w-50 mx-auto
                    "
            >

                <a class="p-1.5" v-tooltip.bottom="'Paramètres'">
                    <div
                        class="
                                bi bi-gear-fill text-(--btn) text-2xl 
                                w-7 h-7 flex justify-center items-center
                        "
                        @click="router.push('/settings')"
                    ></div>
                </a>

                <slot></slot>

                <a class="p-1.5 flex items-center justify-center ">
                    <UserButton
                        :appearance="{
                            ...clerkAppearanceSettings,
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

            <div class="flex flex-col gap-2">

                <hr class="mt-3 mb-4 text-gray-400 -mx-4" />

                <span class="text-xs text-(--text-little) uppercase font-semibold">Onglets</span>

                <li 
                    class="li"
                    @click="setPage('all')"
                    :class="
                        route.query.page !== 'shared' 
                            ? 'bg-(--btn) text-white hover:text-(--btn)'
                            : ''"
                >
                    <i 
                        :class="route.query.page !== 'shared' ? '' : 'text-(--btn)'"
                        class="bi bi-journal-text text-xl"
                    />
                    <span>Toutes les notes</span>
                </li>

                <li 
                    class="li"
                    @click="setPage('shared')"
                    :class="
                        route.query.page == 'shared' 
                            ? 'bg-(--btn) text-white hover:text-(--btn)'
                            : ''"
                >
                    <i 
                        :class="route.query.page == 'shared' ? '' : 'text-(--btn)'"
                        class="bi bi-people-fill text-xl"
                    />
                    <span>Notes partagées</span>
                </li>

            </div>

        </ul>

        <!-- <ul
            class="
                absolute bottom-4 inset-x-4 gap-2 flex flex-col
            "
        >

  
            <li class="flex justify-start items-center flex-row w-full gap-3">

                <UserAvatar />

                <div class="flex flex-col">
                    <span class="text-md">{{ user?.fullName }}</span>
                    <span class="text-xs">Free</span>
                </div>

            </li>

            <li class=" w-full">

                <button
                    class="second w-full"
                >
                    Devenir premium
                </button>

            </li>


        </ul> -->

    </div>

</template>


<script lang="ts" setup>

import { useRoute, useRouter } from 'vue-router';
import { version, dev } from '../../../../../package.json';
import { ref, watch } from 'vue';
import isMobile from '@/assets/ts/utils/isMobile';
import { UserButton } from '@clerk/vue';
import { clerkAppearanceSettings } from '@/assets/ts/theme';

const router = useRouter();
const route = useRoute();
const selectedNote = ref<string>('');

const setPage = (a: 'shared' | 'all'): void => {
    router.push({
        query: {
            ...route.query,
            page: a
        }
    });
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
    padding-left: 2rem;
}

ul li {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: .5rem;
  padding-left: .8rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

ul hr {
    opacity: 50%;
}

ul li:not(.nohover):hover {
  background-color: rgba(131, 131, 131, 0.15);
}

</style>