
<template>

    <Navbar>

        <div 
            class="reload-svg 
                    w-7
                    h-7
                " 
            :class="[
                { rotating: isRotating }
            ]"
            @click="reload_list"
        ></div>

    </Navbar>
    
    <div 
        class="Search_bar flex flex-col lg:flex-row 
                justify-center items-center  gap-4 w-full"
    >

        <Search_bar class="w-1/3" :desktop="isLargeScreen" pt="" />

        <div 
            class="w-full lg:w-2/3 flex items-center justify-center gap-4"
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
                >

                    <Tags_item 
                        @click.stop="add_tag_filter(tag.id)" 
                        @reload="reload_list"
                        :id="tag.id" :name="tag.name" 
                        :tag="tag.name" 
                        :active="tag.active"
                        :color="tag.color"
                    />

                </SwiperSlide>
                    
            </Swiper>

            <div>

                <Tags_item 
                    @click="if_open_create_tag = true" 
                    :id="null"
                    name="+"
                    :tag="''"
                    :active="false"
                    color="#fff5e8"
                    class="w-20"
                />

            </div>

        </div>

    </div>

    <div class=" overflow-x-hidden mb-30" >

        <Danger_card 
            v-if="tip" 
            style="box-shadow: 0 0 15px #3636364f;" 
            class="mt-4"
            title="Tip of the week" 
            content="You can create a new note with +" 
        />

        <Danger_card 
            v-if="if_danger_card" 
            style="box-shadow: 0 0 15px #3636364f;" 
            class="mt-4"
            :title="Danger_card_props?.title"
            :btn="Danger_card_props?.btn"
            :href="Danger_card_props?.href"
            :content="Danger_card_props?.message" 
        />

        <div 
            class="overflow-y-auto mt-4 min-h-screen space-y-5"
            v-if="notes_views_mode == 'tag'"
        >

            <div 
                v-for="tag in all_tags"
            >

                <div v-if="list_notes && list_notes.find(note => note.tags.includes(tag.id))">

                    <div 
                        class="font-bold text-lg p-2 rounded-[var(--br-btn)]
                        border-2 w-30 flex justify-center items-center border-[var(--text)]"
                        :style="{ backgroundColor: tag.color, color: utils.get_text_color(tag.color) }"
                    >
                        {{ tag.name }}
                    </div>

                    <ul 
                        class="space-y-4 mt-2
                        columns-2 md:columns-3 lg:columns-4  "
                    >

                        <li 
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

                        </li>
                    
                    </ul>

                </div>

            </div>

        </div>

        <ul 
            class="overflow-y-hidden h-full mt-4 min-h-[80vh] "
            v-if="notes_views_mode == 'default'"
        >

            <MasonryWrapper v-if="view_notes && list_notes && shared_notes" class="w-full">

                <MasonryHr 
                    class="mt-4 absolute inset-x-0" 
                    v-if="list_notes.filter(note => note.pinned == true).length"
                >
                    <span class="font-bold text-lg">Notes épinglées</span>
                </MasonryHr>

                <MasonryItem
                    v-if="list_notes && list_notes.length"
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
                    v-if="shared_notes && shared_notes.length > 0"
                >
                    <span class="font-bold text-lg">Notes partagées</span>
                </MasonryHr>

                <MasonryItem 
                    v-if="shared_notes && shared_notes.length > 0"
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
                    v-if="list_notes.filter(note => note.pinned == true).length || shared_notes.length"
                >
                    <span class="font-bold text-lg">Autres</span>
                </MasonryHr>

                <MasonryItem 
                    v-if="list_notes && list_notes.length"
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

            <li v-if="list_notes && list_notes.length < 1" class="flex flex-col">

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

            <li v-if="list_notes == undefined" class=" flex-col">
                <Loader :icon="false" />
            </li>

        </ul>

    </div>

    <New_note_btn 
        @btn_click="create_new_note"
    />

    <div v-if="if_open_create_tag">

        <div  
            class="fixed inset-0 bg-black/50 z-100"
            @click="if_open_create_tag = false"
        ></div>

        <section class="flex flex-col gap-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-110">

            <div class="p-1 text-center w-full border-2 bg-[var(--bg2)]/80 border-[#F28C28] rounded-[var(--br-btn)] shadow-lg">
                <input
                    v-model="tag_name"
                    ref="inputRef"
                    type="text"
                    class="outline-none pl-1 w-full"
                    placeholder="Mon dossier"
                    @click.stop="inputRef?.focus()"
                />
            </div>

            <div @click.stop="" class="flex flex-col justify-center items-center border-2 h-full bg-[var(--bg2)]/80 border-[#F28C28] rounded-[var(--br-btn)] shadow-lg" >
                <span>couleur de mon dossier</span>
                <input
                    v-model="tag_color"
                    type="color"
                    class="outline-none w-full h-10 cursor-pointer rounded-[var(--br-btn)] border-none"
                />
            </div>

            <button
                class="primary"
                @click.stop="create_tag(tag_name, tag_color)"
            >
                <span>Créer mon dossier</span>
            </button>
            <button
                class="primary danger"
                @click.stop="if_open_create_tag = false"
            >
                <span>Annuler</span>
            </button>

        </section>

    </div>

</template>

<script setup lang='ts'>

    import { useRouter } from 'vue-router';
    import { onMounted, ref, watch, onUnmounted } from 'vue';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';

    import db from '@/assets/ts/database/database';
    import back from '@/assets/ts/backend_link';
    import utils from '@/assets/ts/utils';
    import type { Note, Tag } from '@/assets/ts/type';
    import { notes_views_mode } from '@/assets/ts/Notes_views'
    import InitDB from '@/assets/ts/database/init';

    import Danger_card from '@/components/Danger_card.vue';
    import Note_card from '@/components/notes/Note_card.vue';
    import Search_bar from './Search_bar.vue';
    import Tags_item from '@/components/tags/Tags_item.vue';
    import Navbar from './NavBar.vue';
    import MasonryWrapper from '@/components/Masonry/MasonryWrapper.vue';
    import MasonryItem from '@/components/Masonry/MasonryItem.vue';
    import MasonryHr from '@/components/Masonry/MasonryHr.vue';
    import Loader from '@/components/Loader.vue';
    import New_note_btn from '@/views/Home/New_note_btn.vue';
    import { 
        Notes as list_notes, 
        Tags as all_tags, 
        SharedNotes as shared_notes 
    } from '@/assets/ts/database/Var';
    
    const router = useRouter();

    const create_new_note = () => router.push(`/edit/new?pinned=false`);

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


    const create_tag = async (tagName: string, tagColor: string): Promise<void> => {

        if (!tagName) return;
        if (!tagColor) tagColor = '#FFF';

        console.log('création du tag :', tagName, '\n avec la couleur :', tagColor);

        tag_name.value = '';
        tag_color.value = '';

        await db.create_tag({ id: -1, name: tagName, active: false, color: tagColor });

        all_tags.value = await db.getAll('tags');
        if_open_create_tag.value = false;

    };

    const reload_list = async () => {        

        if (isRotating.value) return;

        isRotating.value = true;
        view_notes.value = false;

        setTimeout(async () => {

            list_notes.value = [];
            all_tags.value = [];
            shared_notes.value = [];

            await InitDB.init_local_tags();
            await InitDB.init_local_notes();
            await InitDB.init_shared_notes();

            console.log('Rechargement des db...')

            view_notes.value = true;

            setTimeout(() => {
                isRotating.value = false;
            }, 200);

        }, 300);

    };


    onMounted(async () => {

        if_danger_card.value = isOnline.value ? await back.info_message() ? true : false : false; 
        Danger_card_props.value = isOnline.value ? await back.info_message() : undefined;

        await reload_list();

    });

    watch(all_tags, async (newVal: Tag[], oldVal: Tag[]) => {

        const hasActiveChanged = newVal?.some((newTag: Tag, index) => {
            const oldTag = oldVal ? oldVal[index] : undefined;
            return oldTag && newTag.active !== oldTag.active;
        });

        const db_tags = await db.getAll('tags');
        const db_tags_ids = all_tags.value?.map(tag => tag.id).sort();
        const all_tags_ids = db_tags.map(tag => tag.id).sort();

        if (!hasActiveChanged && JSON.stringify(db_tags_ids) !== JSON.stringify(all_tags_ids)) {
            console.log('Update all_tags !');
            all_tags.value = await db.getAll('tags');
        }

    });


</script>

<style scoped>

.break-avoid {
  break-inside: avoid;
  page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
  -moz-column-break-inside: avoid;
}

    .Search_bar {

        margin-top: calc(4.5rem + env(safe-area-inset-top));

        @media (min-width: 1280px) {
            margin-top: calc(5rem + env(safe-area-inset-top));
        }
        
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
        filter: invert(1);
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