
<template>

    <header 
        style="
            font-family: 'InterTight', sans-serif; 
            box-shadow: 0 0 15px #36363681;
            padding-top: calc(env(safe-area-inset-top)/2);
        " 
        class="
                top-0 left-0 w-screen 
                text-2xl  font-bold
                bg-[#F28C28]
                flex items-center justify-center fixed z-50
            "
    >

        <div class="flex flex-row justify-between items-center w-full ml-[var(--mrl)] mr-[var(--mrl)]">
            
            <div class="flex flex-row justify-center items-center">

                <div class="mr-3 flex items-center justify-center">
                    <UserButton />
                </div>

                <h1 class=" text-white flex flex-row justify-center items-center gap-1 md:gap-3 text-3xl" :class="hitbox ? 'bg-red-600' : ''">
                    <img src="/favicon.svg" class="mb:w-6 w-10" alt="logo"><span class="hidden sm:block">SilverNote</span>
                </h1>

            </div>

            <div class="flex flex-row justify-center items-center gap-5 md:gap-5">

                <!-- <div // metttre en auto
                    class="reload-svg 
                            md:w-[24px]  w-[30px]
                            md:h-[24px]  h-[30px]
                        " 
                    :class="[
                        isOnline ? 'wifi-on-svg' : 'wifi-off-svg',
                        hitbox ? 'bg-teal-300' : ''
                    ]"
                    ref="online_btn"
                    @click="toggleOnline"
                ></div> -->

                <div 
                    class="reload-svg  
                            md:w-[24px]  w-[30px]
                            md:h-[24px]  h-[30px]
                        " 
                    :class="[
                        { rotating: isRotating },
                        hitbox ? 'bg-teal-300' : ''
                    ]"
                    @click="reload_list"
                ></div>

                <div 
                    class="saving-svg 
                            md:w-[24px]  w-[30px]
                            md:h-[24px]  h-[30px]
                        " 
                    :class="[
                        { 'jump': isJumping },
                        hitbox ? 'bg-teal-300' : '' 
                    ]"
                    @click="saving_notes"
                ></div>

                <div
                    :class="[ hitbox ? 'bg-teal-300' : '' ]"
                    class="ellipsis-svg
                            md:w-[30px] w-[35px]
                            md:h-[30px] h-[35px]
                        " 
                    @click="if_open_dropdown = !if_open_dropdown"
                ></div>

                <transition name="fade-slide">
                    <div
                        v-if="if_open_dropdown"
                        class="dropdown absolute bg-[#F28C28] 
                            z-50 min-w-[200px] w-[40%] md:w-[20%] lg:w-[10%] 
                            flex flex-col justify-center items-center p-3"
                        :style=" { top: `calc(3.5rem + env(safe-area-inset-top))` } "
                    >
                        <ul class="text-xl md:text-lg text-white">

                            <li 
                                class="flex flex-row" 
                                @click="router.push('/settings')"
                            >
                                <div class="gear-svg"></div>
                                Paramètre
                            </li>

                            <li class="text-xl md:text-lg flex flex-row" @click="openAccount">
                                <div class="nav-svg" style="filter: invert(0);">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                    </svg>
                                </div>
                                Compte
                                <div class="nav-svg mr-0 ml-2" style="filter: invert(1);">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Interface / External_Link">
                                        <path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </g>
                                    </svg>
                                </div>
                            </li>

                            <li class="text-xl md:text-lg flex flex-row">
                                <div class="nav-svg legal-svg">

                                </div>
                                Légal
                            </li>

                        </ul>
                    </div>
                </transition>

            </div>

        </div>

    </header>

    
    <div class="Search_bar flex flex-col lg:flex-row items-center w-full gap-4">

        <Search_bar class="mb-4 lg:mb-0 lg:w-1/2 w-full" :desktop="isLargeScreen" pt="env(safe-area-inset-top)" />

        <Swiper
            v-if="all_tags && all_tags.length" 
            :slides-per-view="'auto'"
            :space-between="8"
            class=" w-full lg:w-1/2 pr-1.5 pl-1.5"
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
                class="grid grid-cols-1 gap-4 overflow-hidden
                        md:grid-cols-[calc(100%/3_-_1rem)_calc(100%/3_-_1rem)_calc(100%/3_-_1rem)] 
                        lg:grid-cols-[calc(100%/4_-_1rem)_calc(100%/4_-_1rem)_calc(100%/4_-_1rem)_calc(100%/4_-_1rem)] 
                       "
            >

                <li 
                    v-if="list_notes && list_notes.length"
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
                        :function_reload="reload_list"
                    />

                </li>

                <li v-else-if="list_notes && list_notes.length == 0" class="flex flex-col">

                    <div 
                        class="note-card bg-[var(--bg2)] p-3 border-2"
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

    </div>

    <div
        v-if="list_notes && list_notes?.length" 
        class="bg-transparent flex justify-center items-center w-full z-50 fixed left-0"
        style="bottom: env(safe-area-inset-bottom);"
    >
        <button 
            style="box-shadow: 0 0 15px #3636364f; " 
            @click="create_new_note" 
            class="add-note-btn cursor-pointer w-full
                    flex items-center justify-center mb-8

                    mr-[calc(var(--mrl))] ml-[calc(var(--mrl))]
                    md:mr-[calc(var(--mrl)_+_1rem_+_10%)] md:ml-[calc(var(--mrl)_+_1rem_+_10%)]
                    lg:mr-[calc(var(--mrl)_+_1rem_+_15%)] lg:ml-[calc(var(--mrl)_+_1rem_+_15%)]
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

    import db from '../assets/ts/database';
    import back from '../assets/ts/backend_link';
    import { init_notes } from '../assets/ts/utils';
    import type { Note, Tag } from '../assets/ts/type';
    import { hitbox as if_hitbox } from '../assets/ts/settings';
    //import { toggle_online } from '../assets/ts/online';

    let hitbox: boolean;
    onMounted(async () => { hitbox = await if_hitbox() });

    import Danger_card from '../components/Danger_card.vue';
    import Note_card from '../components/notes/Note_card.vue';
    import Note_card_loader from '../components/notes/Note_card_loader.vue';
    import Search_bar from '../components/Search_bar.vue';
    import Tags_item from '../components/tags/Tags_item.vue';
import { UserButton } from '@clerk/vue';
    
    const router = useRouter();

    const create_new_note = async (): Promise<void> => {

        router.push(`/edit?id=new&pinned=false&simply_edit=false`);

    };

    const openAccount = () => {
        window.open('https://www.silvernote.fr/user/profile');
    }

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

    // const toggleOnline = () => {
    //     const newVal = !isOnline.value;
    //     if (!navigator.onLine && newVal) return;
    //     toggle_online(newVal);
    //     isOnline.value = newVal;
    //     online_btn.value?.animate(
    //         [
    //             { transform: 'scale(1)' },
    //             { transform: 'scale(0.9)' },
    //             { transform: 'scale(1)' }
    //         ],
    //         {
    //             duration: 150,
    //             easing: 'ease-out'
    //         }
    //     )
    // }

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

    const saving_notes = async (): Promise<void> => {
        if (!isOnline.value) return;
        triggerJump();
        await back.save_all(await db.getAll('notes'), await db.getAll('tags'));
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

        if_danger_card.value = isOnline.value ? await back.info_message() ? true : false : false; 
        Danger_card_props.value = isOnline.value ? await back.info_message() : undefined;

        all_tags.value = undefined;
        list_notes.value = [];

        setTimeout(async () => {
            all_tags.value = await db.getAll('tags');
            await init_notes(list_notes);
        }, isOnline.value ? 600 : 0);

    });

    setTimeout(async () => {
        await reload_list();
    }, 0)

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

</style>