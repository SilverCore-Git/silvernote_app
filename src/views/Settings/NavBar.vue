<template>

    <div 
        class="fixed inset-0 z-50"
        @click="if_open_dropdown = false"
        v-if="if_open_dropdown"
    ></div>

    <header 
        style="
            font-family: 'InterTight', sans-serif; 
            box-shadow: 0 0 15px #36363681;
        " 
        class="
                fixed 
                lg:inset-y-0 lg:left-0 
                inset-x-0 top-0 
                text-2xl font-bold lg:w-60
                bg-[var(--bg2)] z-50 
                lg:p-4 py-1 p-0 mt-4 lg:mt-6 mx-6
                flex items-start justify-center dropdown
            "
    >

        <ul class="w-full">
            
            <li class="flex-col phone-hidden-flex">

                <div class="flex flex-row gap-2 items-center justify-center">

                    <img src="/favicon.svg" class="w-8 rounded-md" />

                    <div class="flex flex-col items-start">
                        <span class="text-base">SilverNote app</span>
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

            <div 
                v-if="false"
                class="flex flex-row justify-between items-center w-full px-4"
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

            <div class="phone-hidden" v-if="false">

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

        </ul>

    </header>

</template>

<script lang="ts" setup>

import { UserButton } from '@clerk/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { version, dev } from '../../../package.json';
import { notes_views_mode, toggle_notes_views_mode, notes_filter, type Notes_filter } from '@/assets/ts/Notes_views';

const router = useRouter();
const if_open_dropdown = ref<boolean>(false);

// const openAccount = () => {
//     window.open('https://www.silvernote.fr/user/profile');
// }

const setFilter = (a: Notes_filter): void => {
    notes_filter.value = a;
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