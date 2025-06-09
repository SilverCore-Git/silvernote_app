
<template>

    <header 
        style="
            font-family: 'Montserrat', sans-serif; 
            box-shadow: 0 0 15px #36363681;
            height: calc(3.5rem + env(safe-area-inset-top));
            padding-top: calc(env(safe-area-inset-top)/2);
        " 
        class="
                mb-5 top-0 left-0 w-full 
                text-2xl font-bold
                bg-[#F28C28] text-white
                flex items-center justify-center fixed z-50
            "
    >

        <div class="flex flex-row justify-center items-center">
            
            <h1 class="absolute left-4" :class="hitbox ? 'bg-red-600' : ''">SilverNote</h1>

            <div 
                class="reload-svg absolute right-24" 
                :class="[
                    { rotating: isRotating },
                    hitbox ? 'bg-teal-300' : ''
                ]"
                @click="reload_list"
            ></div>

            <div 
                class="saving-svg absolute right-14" 
                :class="[
                    { 'jump': isJumping },
                    hitbox ? 'bg-teal-300' : '' 
                ]"
                @click="saving_notes"
            ></div>

            <div
                :class="[ hitbox ? 'bg-teal-300' : '' ]"
                class="ellipsis-svg absolute right-4" 
                @click="if_open_dropdown = !if_open_dropdown"
            ></div>

            <transition name="fade-slide">
                <div
                    v-if="if_open_dropdown"
                    class="dropdown absolute right-0 bg-[#F28C28] 
                        z-50 min-w-[150px] w-[40%] flex flex-col justify-center items-center p-3"
                    :style=" { top: `calc(3.5rem + env(safe-area-inset-top))` } "
                >
                    <ul class="text-xl">
                        <li @click="router.push('/settings')">Paramètre</li>
                        <li @click="router.push('/account')">Compte</li>
                        <li>Aide</li>
                        <li>Légal</li>
                    </ul>
                </div>
            </transition>

        </div>

    </header>

    <Search_bar class="mb-4" pt="env(safe-area-inset-top)" :style=" { marginTop: `calc(4.5rem + env(safe-area-inset-top))` } " />

    <ul 
        v-if="all_tags && all_tags.length" 
        class="flex flex-row mr-4 ml-4 gap-1.5 whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none"
        :class="hitbox ? 'bg-amber-400' : ''"
    >

        <li 
            v-for="(tag, index) in all_tags"
            :key="index" 
        >

            <Tags_item 
                @click="add_tag_filter(tag.id)" 
                :id="tag.id" :name="tag.name" 
                :tag="tag.name" 
                :active="tag.active"
                class="min-w-[70px]"
            />

        </li>
        
        <li 
            class=" min-w-[70px]"
        >

            <Tags_item 
                @click="if_open_create_tag = true" 
                :id="null"
                name="+"
                :tag="''"
                :active="false"
            />

        </li>

    </ul>
    
    <ul 
        v-else-if="all_tags" 
        class="flex flex-row justify-center items-center gap-1.5 max-w-[100%] mr-4 ml-4 whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none"
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
            />

        </li>
    </ul>

    <ul 
        v-else 
        class="flex flex-row justify-center items-center gap-1.5 max-w-[100%] mr-4 ml-4 whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none"
    >
        <Tags_item_loader />
        <Tags_item_loader />
        <Tags_item_loader />
        <Tags_item_loader />
    </ul>

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

        <div class="overflow-y-auto mt-4 min-h-[60vh]" :class="hitbox ? 'bg-purple-600' : ''">

            <ul>

                <li v-if="list_notes && list_notes.length" class="flex flex-col" v-for="(note, index) in list_notes" :key="index">
                    <Note_card 
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
                        class="note-card bg-[#FFF8F0] mr-4 ml-4 text-[#3B3B3B] p-3 border-[#3B3B3B] border-2"
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
                class="add-note-btn cursor-pointer flex items-center justify-center absolute right-4 left-4 bottom-4"
            ><div class="add-note-svg"></div></button>
        </div>

    </div>

    <div @click="if_open_create_tag = false" v-if="if_open_create_tag">

        <div  class="fixed inset-0 bg-black/50 z-100"></div>

            <section class="flex flex-col gap-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-110">

            <div class="p-1 text-center w-full border-2 bg-white/80 border-[#F28C28] rounded-[15px] shadow-lg">
                <input
                    v-model="tag_name"
                    ref="inputRef"
                    type="text"
                    class="outline-none pl-1 w-full"
                    placeholder="Mon dossier"
                    @click.stop="inputRef?.focus()"
                />
            </div>

            <button
                class="p-1 text-center w-full border-2 bg-white/80 text-[#F28C28] font-bold cursor-pointer rounded-[15px] shadow-md
                        hover:bg-[#f28c28]"
                @click.stop="create_tag(tag_name)"
            >
                <span>Créer mon dossier</span>
            </button>

        </section>

    </div>

</template>

<script setup lang='ts'>

    import { useRouter } from 'vue-router';
    import { onMounted, ref, watch } from 'vue';

    import db from '../assets/ts/database';
    import back from '../assets/ts/backend_link';
    //import os from '../assets/ts/os';
    import { init_notes } from '../assets/ts/utils';
    import type { Note } from '../assets/ts/type';
    import { hitbox as if_hitbox } from '../assets/ts/settings';

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


    const tip: boolean = false;
    const tag_name = ref<string>('');
    const if_danger_card: boolean = back.info_message() ? true : false;
    const Danger_card_props: { message: string, title: string, btn: boolean, href: string } | void = back.info_message();

    const list_notes = ref<Note[] | undefined>([]);
    let all_tags = ref<{ id: number, name: string, active: boolean }[] | undefined>(undefined);

    const isRotating = ref(false);
    const if_open_dropdown = ref<boolean>(false);
    const if_open_create_tag = ref<boolean>(false);
    const inputRef = ref<HTMLInputElement | null>(null);



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

    const create_tag = async (tagName: string): Promise<void> => {
        if (!tagName) return;
        console.log('création du tag :', tagName)
        tag_name.value = '';
        await db.create_tag({ id: -1, name: tagName, active: false });
        all_tags.value = await db.getAll('tags');
        if_open_create_tag.value = false
    };

    const saving_notes = async (): Promise<void> => {
        triggerJump();
        await back.saving_all(await db.getAll('notes'), await db.getAll('tags'));
    };

    const reload_list = async () => {

        if (isRotating.value) return;

        isRotating.value = true;

        setTimeout(async () => {
            list_notes.value = undefined;
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
    });



    watch(list_notes, async () => {

        //const actives_tags = all_tags.value?.filter(tag => tag.active);

        //console.log('Tag active ?', all_tags.value?.some(tag => tag.active), '=>', actives_tags?.map(tag => tag.name));

        if (!all_tags.value?.some(tag => tag.active)) {
            await init_notes(list_notes);
        };

        //console.log("Les notes ont été modifiées, tri en cours...");

    }, { deep: true });


</script>

<style scoped>

    .gear-svg {
        width: 30px;
        height: 30px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../assets/svgs/gear.svg');
        filter: invert(1);
        transition: all 0.3s ease;
    }

    .gear-svg:hover {
        transform: rotate(90deg);
    }

    .gear-svg:active {
        transform: rotate(190deg);
    }

    .ellipsis-svg {
        cursor: pointer;
        width: 30px;
        height: 30px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('/assets/svgs/ellipsis.svg');
        filter: invert(1);
        transition: all 0.3s ease;
    }

    .saving-svg {
        cursor: pointer;
        width: 24px;
        height: 24px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../assets/svgs/saving_disc.svg');
        filter: invert(1);
        transition: all 0.3s ease;
    }
        
    .reload-svg {
        cursor: pointer;
        width: 24px;
        height: 24px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../assets/svgs/reload.svg');
        filter: invert(1);
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
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
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
        border-radius: 15px;
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