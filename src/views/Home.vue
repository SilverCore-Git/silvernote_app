
<template>

    <header 
        style="
            font-family: 'Montserrat', sans-serif; 
            box-shadow: 0 0 15px #36363681;
            padding-top: calc(env(safe-area-inset-top)/2);
        " 
        class="
                top-0 left-0 w-full 
                text-2xl  font-bold
                bg-[#F28C28]
                flex items-center justify-center fixed z-50
            "
    >

        <div class="flex flex-row justify-center items-center">
            
            <h1 class="absolute left-4 text-white flex flex-row" :class="hitbox ? 'bg-red-600' : ''"><img src="/favicon.svg" class="w-6 mr-2" alt="logo">SilverNote</h1>

            <div 
                class="reload-svg absolute 
                        right-36
                        w-[24px] 
                        h-[24px] 
                    " 
                :class="[
                    ifLight ? 'moon-svg' : 'sun-svg',
                    hitbox ? 'bg-teal-300' : ''
                ]"
                ref="theme_btn"
                @click="toggleTheme"
            ></div>

            <div 
                class="reload-svg absolute 
                        right-25 
                        w-[24px] 
                        h-[24px] 
                    " 
                :class="[
                    { rotating: isRotating },
                    hitbox ? 'bg-teal-300' : ''
                ]"
                @click="reload_list"
            ></div>

            <div 
                class="saving-svg absolute
                        right-14 
                        w-[24px] 
                        h-[24px] 
                    " 
                :class="[
                    { 'jump': isJumping },
                    hitbox ? 'bg-teal-300' : '' 
                ]"
                @click="saving_notes"
            ></div>

            <div
                :class="[ hitbox ? 'bg-teal-300' : '' ]"
                class="ellipsis-svg absolute
                        right-4
                        w-[30px]
                        h-[30px]
                    " 
                @click="if_open_dropdown = !if_open_dropdown"
            ></div>

            <transition name="fade-slide">
                <div
                    v-if="if_open_dropdown"
                    class="dropdown absolute right-0 bg-[#F28C28] 
                        z-50 min-w-[200px] w-[40%] md:w-[20%] lg:w-[10%] flex flex-col justify-center items-center p-3"
                    :style=" { top: `calc(3.5rem + env(safe-area-inset-top))` } "
                >
                    <ul class="text-xl text-white">

                        <li 
                            class="flex flex-row" 
                            @click="router.push('/settings')"
                        >
                            <div class="gear-svg"></div>
                            Paramètre
                        </li>

                        <li class="flex flex-row" @click="router.push('/account')">
                            <div class="nav-svg" style="filter: invert(0);">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                </svg>
                            </div>
                            Compte
                        </li>

                        <li class="flex flex-row">
                            <div class="nav-svg legal-svg">

                            </div>
                            Légal
                        </li>

                        <li class="flex flex-row mt-1 text-sm" v-if="if_dev" @click="router.push('/dev')">Développeurs</li>

                    </ul>
                </div>
            </transition>

        </div>

    </header>

    
    <div class="Search_bar flex flex-col lg:flex-row items-center w-full px-4 gap-4">

        <Search_bar class="mb-4 lg:mb-0 lg:w-1/2 w-full" :desktop="isLargeScreen" pt="env(safe-area-inset-top)" />

        <Swiper
            v-if="all_tags && all_tags.length" 
            :slides-per-view="5"
            :space-between="8"
            class="flex-shrink-0 w-full lg:w-1/2 pr-1.5 pl-1.5"
            :class="[hitbox ? 'bg-amber-400' : '', 'lg:scrollbar-thin', 'scrollbar-thumb-rounded']"
        >

            <SwiperSlide 
                v-for="(tag, index) in all_tags"
                :key="index" 
            >

                <Tags_item 
                    @click.stop="add_tag_filter(tag.id)" 
                    :id="tag.id" :name="tag.name" 
                    :tag="tag.name" 
                    :active="tag.active"
                    :color="tag.color"
                    class="min-w-[70px] flex-shrink-0"
                />

            </SwiperSlide>
            
            <SwiperSlide 
                class=" min-w-[70px]"
            >

                <Tags_item 
                    @click="if_open_create_tag = true" 
                    :id="null"
                    name="+"
                    :tag="''"
                    :active="false"
                    color="#fff5e8"
                    class="flex-shrink-0"
                />

            </SwiperSlide>

        </Swiper>
    
        <ul 
            v-else-if="all_tags" 
            class="flex flex-row justify-center items-center gap-1.5 pr-1.5 pl-1.5 max-w-[100%] mr-4 ml-4 whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none"
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
                />

            </li>
        </ul>

        <ul 
            v-else 
            class="flex flex-row justify-center items-center gap-1.5 pr-1.5 pl-1.5 max-w-[100%] mr-4 ml-4 whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none"
        >
            <Tags_item_loader />
            <Tags_item_loader />
            <Tags_item_loader />
            <Tags_item_loader />
        </ul>

    </div>

    <div @click="if_open_dropdown=false" class=" overflow-x-hidden mb-30" :class="hitbox ? 'bg-rose-600' : ''">

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
            class="overflow-y-auto mt-4 min-h-[60vh]" 
            :class="hitbox ? 'bg-purple-600' : ''"
        >

            <ul 
                class="grid grid-cols-1 
                        md:grid-cols-[33%_33%_33%] 
                        lg:grid-cols-[25%_25%_25%_25%] 
                        xl:grid-cols-[20%_20%_20%_20%_20%] 
                        md:mr-2 md:ml-2
                       "
            >

                <li 
                    v-if="list_notes && list_notes.length" 
                    class=""
                    v-for="(note, index) in list_notes" 
                    :key="index"
                >

                    <Note_card
                        @pin="withdraw"
                        :id="note.id"
                        :pinned="note.pinned"
                        :title="note.title" 
                        :content="note.content" 
                        :date="note.date"
                        :tags="note.tags.map(tag => Number(tag))"
                        :simply_edit="note.simply_edit"
                    />

                </li>

                <li v-else-if="list_notes && list_notes.length == 0" class="flex flex-col">

                    <div 
                        class="note-card bg-[var(--bg2)] mr-4 ml-4 p-3 border-2"
                        style="border-radius: 15px;"
                    >

                        <p class="font-bold text-xl w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                            Aucune note trouvée !
                        </p>

                        <div class="bg-transparent w-full z-50 relative mt-5">
                            <button 
                                style="box-shadow: 0 0 15px #3636364f;" 
                                @click="create_new_note" 
                                class="add-note-btn cursor-pointer flex items-center justify-center w-full"
                            >
                                <div class="add-note-svg"></div>
                            </button>
                        </div>

                    </div>

                </li>

                <li v-else class="flex flex-col">
                    <Note_card_loader class="mb-3" />
                    <Note_card_loader class="mb-3" />
                    <Note_card_loader class="mb-3" />
                    <Note_card_loader class="mb-3" />
                </li>

            </ul>

        </div>
    
        <div
            v-if="list_notes && list_notes?.length" 
            class="bg-transparent w-full z-50 fixed"
            style="bottom: env(safe-area-inset-bottom);"
        >
            <button 
                style="box-shadow: 0 0 15px #3636364f;" 
                @click="create_new_note" 
                class="add-note-btn cursor-pointer 
                        flex items-center justify-center 
                        absolute right-4 left-4 bottom-4
                        md:left-1/4 md:right-1/4
                        lg:left-1/3.5 lg:right-1/3.5
                        xl:left-1/3 xl:right-1/3
                      "
            ><div class="add-note-svg"></div></button>
        </div>

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
                class="p-1 text-center w-full border-2 bg-white/80 font-bold cursor-pointer rounded-[var(--br-btn)] shadow-md
                        hover:bg-[#f28c28]"
                @click.stop="create_tag(tag_name, tag_color)"
            >
                <span>Créer mon dossier</span>
            </button>
            <button
                class="p-1 text-center w-full border-2 bg-white/80 font-bold cursor-pointer rounded-[var(--br-btn)] shadow-md
                        hover:bg-[#f25728]"
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

    import db from '../assets/ts/database';
    import back from '../assets/ts/backend_link';
    import { init_notes } from '../assets/ts/utils';
    import type { Note, Tag } from '../assets/ts/type';
    import { hitbox as if_hitbox, dev as if_dev } from '../assets/ts/settings';
    import { toggle_theme, init_theme } from '../assets/ts/theme';

    let hitbox: boolean;
    onMounted(async () => { hitbox = await if_hitbox() })

    import Danger_card from '../components/Danger_card.vue';
    import Note_card from '../components/Note_card.vue';
    import Note_card_loader from '../components/Note_card_loader.vue';
    import Search_bar from '../components/Search_bar.vue';
    import Tags_item from '../components/Tags_item.vue';
    import Tags_item_loader from '../components/Tags_item_loader.vue';
    
    const router = useRouter();

    const create_new_note = async (): Promise<void> => {

        router.push(`/edit?id=new&pinned=false&simply_edit=false`);

    };

    const ifLight = ref<boolean>(localStorage.getItem('theme') == 'light');
    const theme_btn = ref<HTMLDivElement | null>(null);

    const tip: boolean = false;
    const tag_name = ref<string>('');
    const tag_color = ref<string>('');
    const if_danger_card: boolean = back.info_message() ? true : false;
    const Danger_card_props: { message: string, title: string, btn: boolean, href: string } | void = back.info_message();

    const list_notes = ref<Note[]>([]);
    let all_tags = ref<Tag[] | undefined>(undefined);

    const isRotating = ref(false);
    const if_open_dropdown = ref<boolean>(false);
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

    const toggleTheme = () => {
        const newTheme = !ifLight.value
        toggle_theme(newTheme)
        ifLight.value = newTheme
        theme_btn.value?.animate(
            [
            { transform: 'scale(1)' },
            { transform: 'scale(0.9)' },
            { transform: 'scale(1)' }
            ],
            {
            duration: 150,
            easing: 'ease-out'
            }
        )
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

        const index = id - 1;

        if (all_tags.value?.[index].active) {
            all_tags.value[index].active = false;
            list_notes.value = await db.getAll('notes');
            return;
        };

        if (all_tags.value?.[index]) {
            all_tags.value[index].active = !all_tags.value[index].active;
        }

        const activeTags = all_tags.value
                ?.filter(tag => tag.active)
                .map(tag => tag.id);

        if (activeTags?.length === 0) return;

        const notes = await db.getAll('notes');
        list_notes.value = notes.filter(note => note.tags.some(tag => activeTags?.includes(Number(tag))));

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

    const saving_notes = async (): Promise<void> => {
        triggerJump();
        await back.saving_all(await db.getAll('notes'), await db.getAll('tags'));
    };

    const reload_list = async () => {        

        if (isRotating.value) return;

        isRotating.value = true;

        setTimeout(async () => {
            list_notes.value = [];
            await init_notes(list_notes);
            console.log('Rechargement des notes...')
            setTimeout(() => {
                isRotating.value = false;
            }, 300);
        }, 400);

    };

    const isJumping = ref(false);

    const triggerJump = () => {

        isJumping.value = false;

        requestAnimationFrame(() => {
            isJumping.value = true;
            setTimeout(() => {
            isJumping.value = false;
            }, 500);
        });
        
    };

    onMounted(async () => {
        all_tags.value = await db.getAll('tags');
        await init_notes(list_notes);
        init_theme();
    });


    watch(all_tags, async (newVal, oldVal) => {

        const hasActiveChanged = newVal?.some((newTag, index) => {
            const oldTag = oldVal ? oldVal[index] : undefined;
            return oldTag && newTag.active !== oldTag.active;
        });

        const db_tags = await db.getAll('tags');
        const db_tags_ids = all_tags.value?.map(tag => tag.id).sort();
        const all_tags_ids = db_tags.map(tag => tag.id).sort();

        if (!hasActiveChanged && JSON.stringify(newVal) != JSON.stringify(oldVal) || JSON.stringify(db_tags_ids) !== JSON.stringify(all_tags_ids)) {
            console.log('Update all_tags !');
            all_tags.value = await db.getAll('tags');
        }

    });


</script>

<style scoped>

    .nav-svg {
        filter: invert(1);
        width: 25px;
        height: 25px;
        cursor: pointer;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 10px;
    }

    header {
        height: calc(3.5rem + env(safe-area-inset-top));

        @media (min-width: 1280px) {
            height: calc(4rem + env(safe-area-inset-top));
        }
    }

    .Search_bar {

        margin-top: calc(4.5rem + env(safe-area-inset-top));

        @media (min-width: 1280px) {
            margin-top: calc(5rem + env(safe-area-inset-top));
        }
        
    }
    
    .gear-svg {
        width: 25px;
        height: 25px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../assets/svgs/gear.svg');
        filter: invert(1);
        transition: all 0.3s ease;
        margin-right: 10px;
    }

    .ellipsis-svg {
        cursor: pointer;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('/assets/svgs/ellipsis.svg');
        filter: invert(1);
        transition: all 0.3s ease;
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

    .legal-svg {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;
        background-image: url('../assets/svgs/legal.svg');
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

    .rotating {
        animation: rotate 0.8s linear infinite;
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

    .dropdown {
        border-bottom-left-radius: var(--br-btn);
        border-bottom-right-radius: var(--br-btn);
        box-shadow: 0 15px 15px #36363681;
    }

    .dropdown ul li {
        cursor: pointer;
        transition: all 0.3s;
    }

    .dropdown ul li:hover {
        color: #fff2d0;
    }

    .add-note-btn {
        background-color: #F28C28;
        border-radius: var(--br-btn);
        height: 55px;
        transition: all 0.3s;
    }

    .add-note-btn:hover {
        transform: scale(1.02);
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

    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .fade-slide-enter-from,
    .fade-slide-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }

    .fade-slide-enter-to,
    .fade-slide-leave-from {
        opacity: 1;
        transform: translateY(0);
    }

</style>