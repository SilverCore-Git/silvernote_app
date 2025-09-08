
<template>

    <HomeNavbar>

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

    </HomeNavbar>
    
    <div class="Search_bar flex flex-col lg:flex-row justify-center items-center w-full gap-4">

        <Search_bar class="w-full" :desktop="isLargeScreen" pt="env(safe-area-inset-top)" />

        <Swiper
            v-if="all_tags && all_tags.length" 
            :slides-per-view="'auto'"
            :space-between="8"
            class=" w-full lg:w-500 pr-1.5 pl-1.5"
            :class="[hitbox ? 'bg-amber-400' : '', 'lg:scrollbar-thin', 'scrollbar-thumb-rounded']"
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
            
            <SwiperSlide 
                class="!w-auto"
            >

                <Tags_item 
                    @click="if_open_create_tag = true" 
                    :id="null"
                    name="+"
                    :tag="''"
                    :active="false"
                    color="#fff5e8"
                    class="w-20"
                />

            </SwiperSlide>

        </Swiper>
    
        <ul 
            v-else-if="all_tags" 
            class="flex flex-row justify-center items-center gap-1.5 pr-1.5 pl-1.5 max-w-[100%] whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none"
        >
            <li 
                class=" w-[20%] min-w-[70px]"
            >

                <Tags_item 
                    @click="if_open_create_tag = true; inputRef?.focus()"
                    :id="null"
                    name="+"
                    :tag="''"
                    :active="false"
                    color="#fff5e8"
                    class="w-20"
                />

            </li>
        </ul>

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

                <div v-if="list_notes.find(note => note.tags.includes(tag.id))">

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

        <div 
            class="overflow-hidden h-full mt-4 min-h-[80vh] space-y-5"
            v-if="notes_views_mode == 'default'"
        >

            <MasonryWrapper v-if="list_notes.filter(note => note.pinned == true).length">

                <MasonryItem class="absolute inset-x-0">
                    <span class="font-bold text-lg">Notes épinglées</span>
                </MasonryItem>

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


                <MasonryItem class="absolute inset-x-0" v-if="list_notes.filter(note => note.pinned == true).length">
                    <span class="font-bold text-lg">Autres</span>
                </MasonryItem>

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

                    <li v-if="list_notes && list_notes.length == 0" class="flex flex-col">

                        <div 
                            class="note-card bg-[var(--bg2)] p-3 border-2"
                            style="border-radius: 15px;"
                        >

                            <p class="font-bold text-xl w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                Aucune note trouvée !
                            </p>

                        </div>

                    </li>

                    <li v-else class="hidden  flex-col">
                        <Note_card_loader class="mb-3" />
                        <Note_card_loader class="mb-3" />
                        <Note_card_loader class="mb-3" />
                        <Note_card_loader class="mb-3" />
                    </li>

            </MasonryWrapper>

        </div>

    </div>

    <div
        class="bg-transparent flex justify-center items-center w-full z-50 fixed left-0"
        style="bottom: env(safe-area-inset-bottom);"
    >
        <button 
            style="box-shadow: 0 0 15px #3636364f; " 
            @click="create_new_note" 
            class="add-note-btn cursor-pointer rounded-full
                    flex items-center justify-center mb-8 p-2
                  "
        ><div class="add-note-svg"></div></button>
    </div>

    <div @click="if_open_create_tag = false" v-if="if_open_create_tag">

        <div  class="fixed inset-0 bg-black/50 z-100"></div>

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

    import db from '@/assets/ts/database';
    import back from '@/assets/ts/backend_link';
    import utils, { init_notes } from '@/assets/ts/utils';
    import type { Note, Tag } from '@/assets/ts/type';
    import { hitbox as if_hitbox } from '@/assets/ts/settings';
    import { notes_views_mode } from '@/assets/ts/Notes_views'

    let hitbox: boolean;
    onMounted(async () => { hitbox = await if_hitbox() });

    import Danger_card from '../components/Danger_card.vue';
    import Note_card from '../components/notes/Note_card.vue';
    import Note_card_loader from '../components/notes/Note_card_loader.vue';
    import Search_bar from '../components/Search_bar.vue';
    import Tags_item from '../components/tags/Tags_item.vue';
    import HomeNavbar from '@/components/navbar/HomeNavbar.vue';
import MasonryWrapper from '@/components/Masonry/MasonryWrapper.vue';
import MasonryItem from '@/components/Masonry/MasonryItem.vue';
    
    const router = useRouter();

    const create_new_note = async (): Promise<void> => {

        router.push(`/edit/new?pinned=false`);

    };

    const isOnline = ref<boolean>(localStorage.getItem('online') == "true");
    //const online_btn = ref<HTMLDivElement | null>(null);

    const tip: boolean = false;
    const tag_name = ref<string>('');
    const tag_color = ref<string>('');
    const if_danger_card = ref<boolean>(false); 
    const Danger_card_props = ref<{ message: string, title: string, btn: boolean, href: string } | undefined>(undefined);

    const list_notes = ref<Note[]>([]);
    const all_tags = ref<Tag[] | undefined>(undefined);

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

        setTimeout(async () => {
            list_notes.value = [];
            all_tags.value = []
            await init_notes(list_notes);
            all_tags.value = await db.getAll('tags');
            console.log('Rechargement des notes...')
            setTimeout(() => {
                isRotating.value = false;
            }, 200);
        }, 300);

    };


    onMounted(async () => {

        if_danger_card.value = isOnline.value ? await back.info_message() ? true : false : false; 
        Danger_card_props.value = isOnline.value ? await back.info_message() : undefined;

        all_tags.value = undefined;
        list_notes.value = [];

        setTimeout(async () => {
            all_tags.value = await db.getAll('tags');
            await init_notes(list_notes);
        }, isOnline.value ? 600 : 0);

        setTimeout(async () => {
            await reload_list();
        }, 1000)

    });

    watch(all_tags, async (newVal, oldVal) => {

        const hasActiveChanged = newVal?.some((newTag, index) => {
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
        background-image: url('../assets/svgs/saving_disc.svg');
        filter: invert(1);
        transition: all 0.3s ease;
    }

    .reload-svg {
        cursor: pointer;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../assets/svgs/reload.svg');
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

    .add-note-btn {
        background-color: var(--btn);
        transition: all 0.3s;
    }

    .add-note-btn:hover {
        transform: scale(1.1);
    }

    .add-note-btn:active {
        transform: scale(0.98);
    }

    .add-note-svg {

        -webkit-mask-image: url('../assets/svgs/plus.svg');
        mask-image: url('../assets/svgs/plus.svg');
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: contain;
        mask-size: contain;
        background-color: #FFF8F0;
        width: 55px;
        height: 55px;
    }

</style>