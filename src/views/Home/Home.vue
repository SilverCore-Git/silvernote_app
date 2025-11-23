
<template>

    <Navbar >

        <a class="p-1.5" v-tooltip.bottom="'Recharger'">
            <div
                class="reload-svg
                        w-6
                        h-6
                    " 
                :class="[
                    { rotating: isRotating }
                ]"
                @click="reload_list()"
            ></div>
        </a>

    </Navbar>
    
    <div class="p-6 flex flex-col max-h-screen lg:h-screen h-[90vh] overflow-hidden w-full">

        <div 
            class=" flex flex-col flex-shrink-0 mb-4 
                    justify-center items-start gap-4 w-full"
        >

            <div
                class="flex flex-col gap-2 w-full"
            >

                <Search_bar />

                <div 
                    class="flex items-center justify-center gap-4"
                >
                
                    <Swiper
                        :slides-per-view="'auto'"
                        :space-between="8"
                        class="w-full lg:w-500 pr-1.5 pl-1.5 rounded-xl"
                        v-if="all_tags && all_tags.length" 
                    >

                        <SwiperSlide 
                            v-for="(tag, index) in all_tags"
                            :key="index"
                            class="!w-auto"
                            @click.stop="add_tag_filter(tag.id)" 
                        >

                            <Tags_item 
                                @reload="reload_list"
                                :id="tag.id" :name="tag.name" 
                                :tag="tag.name" 
                                :active="tag.active"
                                :color="tag.color"
                            />

                        </SwiperSlide>
                            
                    </Swiper>

                    <div 
                        v-tooltip.bottom="'Créer un tag'" 
                        @click="openTagCreator"
                    >

                        <Tags_item 
                            :id="null"
                            name="+"
                            :tag="''"
                            :active="false"
                            color="#fff5e8"
                            class="w-20 button-scale
                            transition-all duration-200"
                        />

                    </div>

                </div>

            </div>

            <Danger_card 
                v-if="tip" 
                style="box-shadow: 0 0 15px #3636364f;" 
                class="mt-4 lg:w-2/3"
                title="Tip of the week" 
                content="You can create a new note with +" 
            />

            <Danger_card 
                v-if="if_danger_card" 
                style="box-shadow: 0 0 15px #3636364f;" 
                class="mt-4 w-full"
                :title="Danger_card_props?.title"
                :btn="Danger_card_props?.btn"
                :href="Danger_card_props?.href"
                :content="Danger_card_props?.message" 
            />

        </div>

        <div 
            class="flex-1 overflow-y-auto overflow-x-hidden h-full
                    p-2 pt-0 pb-60 shadow-inner rounded-2xl" 
        >

            <div 
                class="space-y-5"
                v-if="notes_views_mode == 'tag'"
            >

                <div 
                    v-for="tag in all_tags"
                >

                    <div v-if="list_notes && list_notes.find(note => Array.isArray(note.tags) && note.tags.includes(tag.id))">

                        <div 
                            class="font-bold text-lg p-2 rounded-[var(--br-btn)]
                            border-2 w-30 flex justify-center items-center border-[var(--text)]"
                            :style="{ backgroundColor: tag.color, color: utils.get_text_color(tag.color) }"
                        >
                            {{ tag.name }}
                        </div>

                        <MasonryWrapper 
                            class="space-y-4 mt-2
                            columns-2 md:columns-3 lg:columns-4  "
                        >

                            <MasonryItem 
                                v-if="list_notes && list_notes.length"
                                v-for="(note, index) in list_notes.filter(note => note.tags.includes(tag.id))" 
                                :key="index"
                            >

                                <Note_card
                                    @pin="withdraw"
                                    :id="note.id"
                                    :icon="note.icon"
                                    :uuid="note.uuid"
                                    :pinned="note.pinned"
                                    :title="note.title" 
                                    :content="note.content" 
                                    :date="note.date"
                                    :tags="note.tags.map(tag => Number(tag))"
                                    :function_reload="reload_list"
                                />

                            </MasonryItem>
                        
                        </MasonryWrapper>

                    </div>

                </div>

            </div>

            <ul
                v-if="notes_views_mode == 'default'"
            >

                <MasonryWrapper 
                    v-if="view_notes && list_notes && shared_notes && list_notes.length > 0"
                    class="w-full "
                >

                    <MasonryHr 
                        class="mt-4 absolute inset-x-0"
                        v-if="list_notes.filter(note=> note.pinned == true).length && notes_filter == 'all' || notes_filter == 'pinned'"
                    >
                        <span class="font-bold text-lg">Notes épinglées</span>
                    </MasonryHr>

                    <MasonryItem
                        v-if="list_notes && list_notes.length && notes_filter == 'all' || notes_filter == 'pinned' "
                        v-for="(note, index) in list_notes.filter(note => note.pinned == true)" 
                        :key="index"
                    >

                        <Note_card
                            @pin="withdraw"
                            :id="note.id"
                            :uuid="note.uuid"
                            :pinned="note.pinned"
                            :icon="note.icon"
                            :title="note.title" 
                            :content="note.content" 
                            :date="note.date"
                            :tags="note.tags.map(tag => Number(tag))"
                            :function_reload="reload_list"
                        />

                    </MasonryItem>



                    <MasonryHr 
                        class="mt-4 absolute inset-x-0" 
                        v-if="shared_notes && shared_notes.length > 0 && notes_filter == 'all' || notes_filter == 'shared'"
                    >
                        <span class="font-bold text-lg">Notes partagées</span>
                    </MasonryHr>

                    <MasonryItem 
                        v-if="shared_notes && shared_notes.length > 0 && notes_filter == 'all' || notes_filter == 'shared' "
                        v-for="(note, index) in shared_notes" 
                        :key="index"
                    >

                        <Note_card
                            @pin="withdraw"
                            :id="note.id"
                            :uuid="note.uuid"
                            :pinned="note.pinned"
                            :icon="note.icon"
                            :title="note.title" 
                            :content="note.content" 
                            :date="note.date"
                            :tags="note.tags.map(tag => Number(tag))"
                            :function_reload="reload_list"
                            :click="() => router.push(`/share/${note.uuid}`)"
                        />

                    </MasonryItem>


                    <MasonryHr 
                        class="mt-4 absolute inset-x-0" 
                        v-if="list_notes.filter(note => note.pinned == true).length || shared_notes.length && notes_filter === 'all' "
                    >
                        <span class="font-bold text-lg">Autres</span>
                    </MasonryHr>

                    <MasonryItem 
                        v-if="list_notes && list_notes.length && notes_filter == 'all'"
                        v-for="(note, index) in list_notes.filter(note => note.pinned == false)" 
                        :key="index"
                    >

                        <Note_card
                            @pin="withdraw"
                            :id="note.id"
                            :uuid="note.uuid"
                            :pinned="note.pinned"
                            :icon="note.icon"
                            :title="note.title" 
                            :content="note.content" 
                            :date="note.date"
                            :tags="note.tags.map(tag => Number(tag))"
                            :function_reload="reload_list"
                        />

                    </MasonryItem>


                </MasonryWrapper>

                <li v-else-if="!isRotating && view_notes" class="flex flex-col">

                    <div 
                        class="w-full h-full py-20 flex justify-center items-center flex-col gap-2"
                    >

                        <div class="w-30 h-30">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 17L21 21M21 17L17 21M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H13M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M19 9V14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>

                        <p class="font-bold text-xl">
                            Aucune note trouvée !
                        </p>

                        <div 
                            v-if="all_tags?.filter(tag => tag.active == true).length"
                            class="font-bold text-xl flex flex-col max-w-55 mt-6"
                        >

                            <span class="mb-2">Filtre activé :</span>

                            <ul class="flex flex-wrap gap-2">
                                <span 
                                    v-for="tag in all_tags?.filter(tag => tag.active == true)"
                                    class="border border-[var(--text)] px-1.5 rounded-lg uppercase text-sm truncate"
                                    :style="{ backgroundColor: tag.color, color: utils.get_text_color(tag.color) }"
                                >
                                    {{ tag.name }}
                                </span>
                            </ul>

                        </div>

                        <div
                            v-else
                        >

                            <button 
                                @click="create_new_note"
                                class="primary scale uppercase"
                            >
                                créer une note
                            </button>

                        </div>

                    </div>

                </li>

                <li v-else class="pt-4 w-full">
                    <ul class="flex gap-4 flex-wrap">
                        <li 
                            v-for="i in 4"
                            :key="i"
                            class="animate-pulse bg-gray-300 h-60 w-50 rounded-xl"
                        ></li>
                    </ul>
                </li>

            </ul>

        </div>

    </div>

    <div 
        :class="[
            `flex justify-center items-center
            pointer-events-none z-50`,
            isMobile 
                ? 'fixed right-6 bottom-6' 
                : 'fixed inset-x-0 bottom-6'
        ]"
    >
    <div 
            @click="create_new_note()" 
            class="w-16 h-16 pointer-events-auto"
        >
            <New_note_btn />
        </div>
    </div>

    <Teleport to="body">

        <Transition name="fade-slide">

            <Popup 
                v-model:visible="if_open_create_tag"
                @update:visible="if_open_create_tag = $event"
            >

                <div
                    class="
                        relative flex flex-col gap-6 
                    "
                    @click.stop
                >
                    
                    <h2 class="text-center text-xl font-semibold text-[var(--btn)] drop-shadow-sm">
                        Nouveau tag
                    </h2>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-bold">Nom du tag</label>
                        <input
                            v-model="tag_name"
                            ref="inputRef"
                            type="text"
                            class="px-3 py-2 rounded-xl bg-[var(--bg)]/80 border border-[var(--btn)]/40 focus:border-[var(--btn)] outline-none shadow-inner placeholder-gray-400 transition"
                            placeholder="ex : Travail, Idée, Projet..."
                        />
                    </div>

                    <div class="flex flex-col gap-2">

                        <label class="text-sm font-bold">Couleur</label>

                        <div class="flex items-center justify-between bg-[var(--bg)]/80 rounded-xl border border-[var(--btn)]/40 px-3 py-2">
                            <span class="text-sm">Choisissez une couleur :</span>
                            <input
                                v-model="tag_color"
                                type="color"
                                class="cursor-pointer w-10 h-10 rounded-full border-2 border-[var(--btn)]/50 transition hover:scale-110 hover:border-[var(--btn)]"
                            />
                        </div>

                    </div>

                    <div class="flex justify-center">
                        <span
                            class="px-4 py-2 rounded-full text-sm font-semibold shadow-md border transition-all"
                            :style="{ backgroundColor: tag_color, borderColor: tag_color }"
                        >
                            {{ tag_name || 'Mon tag' }}
                        </span>
                    </div>

                    <div class="flex gap-3 justify-center mt-2">
                        
                        <button
                            class="primary flex-1"
                            @click.stop="create_tag"
                        >
                            Créer
                        </button>

                        <button
                            class="primary danger flex-1"
                            @click.stop="if_open_create_tag = false"
                        >
                            Annuler
                        </button>

                    </div>

                </div>

            </Popup>

        </Transition>

    </Teleport>

</template>

<script setup lang='ts'>

    import { useRouter } from 'vue-router';
    import { onMounted, ref, watch, onUnmounted, nextTick } from 'vue';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';

    import db from '@/assets/ts/database/database';
    import back from '@/assets/ts/backend_link';
    import utils from '@/assets/ts/utils';
    import type { Note, Tag } from '@/assets/ts/type';
    import { notes_filter, notes_views_mode } from '@/assets/ts/Notes_views';
    import InitDB from '@/assets/ts/database/init';

    import Danger_card from '@/components/Danger_card.vue';
    import Note_card from '@/components/notes/Note_card.vue';
    import Search_bar from './Search_bar.vue';
    import Tags_item from '@/components/tags/Tags_item.vue';
    import Navbar from './NavBar.vue';
    import MasonryWrapper from '@/components/Masonry/MasonryWrapper.vue';
    import MasonryItem from '@/components/Masonry/MasonryItem.vue';
    import MasonryHr from '@/components/Masonry/MasonryHr.vue';
    import { 
        Notes as list_notes, 
        Tags as all_tags, 
        SharedNotes as shared_notes 
    } from '@/assets/ts/database/Var';
    import Popup from '@/components/popup/Popup.vue';
    import { usePlan } from '@/assets/ts/user/UserPlan';
    import { salert } from '@/assets/ts/salert';
    import New_note_btn from './New_note_btn.vue';
import isMobile from '@/assets/ts/utils/isMobile';
    
    const router = useRouter();
    const { plan } = usePlan();


    const isOnline = ref<boolean>(localStorage.getItem('online') == "true");
    //const online_btn = ref<HTMLDivElement | null>(null);

    const tip: boolean = false;
    const tag_name = ref<string>('');
    const tag_color = ref<string>('');
    const view_notes = ref<boolean>(false);
    const if_danger_card = ref<boolean>(false); 
    const Danger_card_props = ref<{ message: string, title: string, btn: boolean, href: string } | undefined>(undefined);

    const isRotating = ref(false);
    const if_open_create_tag = ref<boolean>(false);
    const inputRef = ref<HTMLInputElement | null>(null);

    const isLargeScreen = ref(window.innerWidth >= 1024)

    const updateSize = () => {
        isLargeScreen.value = window.innerWidth >= 1024;
    }

    onMounted(() => {
        window.addEventListener('resize', updateSize);
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateSize);
    })


    const openTagCreator = async () => {
        if_open_create_tag.value = true; 
        tag_color.value = utils.getRandomHexColor();
        await nextTick();
        inputRef.value?.focus()
    }

    const withdraw = async () => {
        const notes: Note[] = await db.getAll('notes');
        list_notes.value = notes.sort((a: Note, b: Note) => {
            if (a.pinned === b.pinned) {
                return b.id - a.id;
            }
                return a.pinned ? -1 : 1;
        });
    }

    const add_tag_filter = async (id: number): Promise<void> => {

        
        const tag = all_tags.value?.find(tag => tag.id === id);
        if (!tag) return;

        
        tag.active = !tag.active;

        
        const activeTags = all_tags.value
            ?.filter(tag => tag.active)
            .map(tag => tag.id);

            
        if (!activeTags || activeTags.length === 0) {
            list_notes.value = await db.getAll('notes');
            return;
        }

        const notes = await db.getAll('notes');
        list_notes.value = notes.filter(note =>
            note.tags.some(tag => activeTags.includes(Number(tag)))
        );

    };


    const create_tag = async (): Promise<void> => {

        if (!tag_name.value) return;
        if (!plan.value || !plan.value.benefits) {
            new salert('Plan et benefits ne sont pas définit.', 'error');
            return;
        }

        const tagLength = all_tags.value.length;

        if (tagLength > plan.value!.benefits!.tagsLength) // si le plan est epuisé en tag
        {
            new salert('Nombre de tag maximal autorisé par le plan atteint.', 'error');
            if_open_create_tag.value = false;
            return
        }

        console.log('création du tag :', tag_name.value, '\n avec la couleur :', tag_color.value);

        await db.create_tag({
            uuid: '',
            _id: '',
            id: -1, 
            name: tag_name.value, 
            active: false, 
            color: tag_color.value 
        }, true);

        tag_name.value = '';
        tag_color.value = '';

        all_tags.value = await db.getAll('tags');
        if_open_create_tag.value = false;

    };

    const create_new_note = () => {

        const notesLength = list_notes.value.length;
        if (!plan.value || !plan.value.benefits) return new salert('Plan et benefits ne sont pas définit.', 'error');

        if (notesLength > plan.value.benefits.notesLength) // si le plan est épuisé en note
        {
            return new salert('Nombre de note maximal autorisé par le plan atteint.', 'error');
        }

        router.push(`/edit/new?pinned=false`);

    }

    const reload_list = async (a?: 'just_view' | 'local') => { // fonction complexe ne pas toucher

        if (isRotating.value) return;
        
        isRotating.value = true;
        
        if (a == 'just_view') {
            view_notes.value = false;
            await nextTick();
            view_notes.value = true;
            return;
        }

        view_notes.value = false;

        if (a == 'local')
        {
            await nextTick();

            await InitDB.init_local_tags();
            await InitDB.init_local_notes();
            await InitDB.init_shared_notes();

            console.log('Reload local db');
        }


        if (!a)
        {
            await nextTick();

            async function fetchCloud()
            {
                await db.reset().then(async () => {
                    await InitDB.init_cloud_tags();
                    await InitDB.init_cloud_notes();
                });
                await InitDB.init_shared_notes();
            }

            await fetchCloud().then(async () => {

                await InitDB.init_local_tags();
                await InitDB.init_local_notes();

                console.log('Reload db');

            })

        }

        setTimeout(async () => {
            await nextTick();
            view_notes.value = true;
        }, 100)

        setTimeout(() => {
            isRotating.value = false;
        }, 200);

    }


    onMounted(async () => {

        reload_list('local');

        if_danger_card.value = isOnline.value ? await back.info_message() ? true : false : false; 
        Danger_card_props.value = isOnline.value ? await back.info_message() : undefined;

    });

    watch(all_tags, async (newVal: Tag[], oldVal: Tag[]) => {
        if (isRotating) return;
        if (!oldVal || oldVal.length === 0) return;

        const hasActiveChanged = newVal.some(newTag => {
            const oldTag = oldVal.find(t => t.id === newTag.id);
            return oldTag && oldTag.active !== newTag.active;
        });

        const db_tags = await db.getAll('tags');
        const db_tags_ids = all_tags.value?.map(tag => tag.id).sort();
        const all_tags_ids = db_tags.map(tag => tag.id).sort();

        if (!hasActiveChanged && JSON.stringify(db_tags_ids) !== JSON.stringify(all_tags_ids)) {
            console.log('Update all_tags !');
            all_tags.value = await db.getAll('tags');
        }

    });

    watch(() => notes_filter.value, async () => {
        view_notes.value = false;
        await nextTick();
        view_notes.value = true;
    })


</script>

<style scoped>

.break-avoid {
  break-inside: avoid;
  page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
  -moz-column-break-inside: avoid;
}


    .saving-svg {
        cursor: pointer;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../assets/svgs/saving_disc.svg');
        filter: invert(1);
        transition: all 0.3s ease;
    }

    .reload-svg {
        cursor: pointer;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../assets/svgs/reload.svg');
        filter: brightness(0) saturate(100%) invert(61%) sepia(43%) saturate(1182%) hue-rotate(343deg) brightness(99%) contrast(92%);
    }

    .moon-svg {
        cursor: pointer;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('/assets/svgs/moon.svg');
        filter: invert(1);
        transition: all 0.3s;
    }

    .sun-svg {
        cursor: pointer;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('/assets/svgs/sun.svg');
        filter: invert(1);
        transition: all 0.3s;
    }

    .wifi-on-svg {
        cursor: pointer;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('/assets/svgs/wifi_on.svg');
        filter: invert(1);
        transition: all 0.3s;
    }

    .wifi-off-svg {
        cursor: pointer;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('/assets/svgs/wifi_off.svg');
        filter: invert(1);
        transition: all 0.3s;
    }

    .rotating {
        animation: rotate 0.6s linear infinite;
    }

    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes squashJump {
        0% {
            transform: scale(1, 1) translateY(0);
        }
        10% {
            transform: scale(1.066, 0.933) translateY(0);
        }
        30% {
            transform: scale(0.967, 1.033) translateY(-10px); 
        }
        50% {
            transform: scale(1, 1) translateY(0);
        }
        70% {
            transform: scale(1.1, 0.9);
        }
        100% {
            transform: scale(1, 1); 
        }
    }

    .jump {
        animation: squashJump 0.5s ease-out;
    }

</style>