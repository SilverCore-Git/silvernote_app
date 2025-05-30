
<template>

    <header 
        style="font-family: 'Montserrat', sans-serif; box-shadow: 0 0 15px #36363681;" 
        class="mb-5 top-0 left-0 w-full h-14 text-2xl bg-[#F28C28] text-white font-bold flex items-center justify-center fixed z-50"
    >
        
        <h1 class="absolute left-4">SilverNote</h1>
        <div class="ellipsis-svg absolute right-4" @click="if_open_dropdown=!if_open_dropdown"></div>

        <transition name="fade-slide">
            <div 
                v-if="if_open_dropdown"
                class="dropdown absolute top-14 right-3 bg-[#F28C28] 
                    z-50 min-w-[150px] w-[40%] flex flex-col justify-center items-center p-3"
            >
                <ul class="text-xl">
                    <li @click="router.push('/settings')">Paramètre</li>
                    <li @click="router.push('/account')">Compte</li>
                    <li>Aide</li>
                    <li>Légal</li>
                </ul>
            </div>
        </transition>

    </header>

    <Search_bar class="fixed right-4 left-4 top-16 z-40" />

    <ul v-if="notes_parms.tags" class="mt-30 flex flex-row justify-center items-center gap-1.5 max-w-[100%] mr-4 ml-4 whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none">

        <li 
            v-for="(tag, index) in notes_parms.tags"
            :key="index" 
            class=" w-[20%] min-w-[70px]"
        >

            <Tags_item 
                @click="add_tag_filter(tag.id)" 
                :id="tag.id" :name="tag.name" 
                :tag="tag.name" 
                :active="tag.active" 
            />

        </li>
        
        <li 
            class=" w-[20%] min-w-[70px]"
        >

            <Tags_item 
                @click="create_tag" 
                :id="null"
                name="+"
                :tag="''"
                :active="false"
            />

        </li>

    </ul>

    <ul v-else class="mt-30 flex flex-row justify-center items-center gap-1.5 max-w-[100%] mr-4 ml-4 whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none">
        <Tags_item_loader />
        <Tags_item_loader />
        <Tags_item_loader />
        <Tags_item_loader />
    </ul>

    <div @click="if_open_dropdown=false" class=" overflow-x-hidden mb-30">

        <Danger_card v-if="tip" style="box-shadow: 0 0 15px #3636364f;" title="Tip of the week" content="You can create a new note with +" />

        <div class="overflow-y-auto mt-4">

            <ul>

                <li v-if="list_notes" class="flex flex-col" v-for="(note, index) in list_notes" :key="index">
                    <Note_card 
                        :id="note.id"
                        :pinned="note.pinned"
                        class="mb-3" :title="note.title" 
                        :content="note.content" 
                        :date="note.date"
                        :tags="note.tags"
                        :simply_edit="note.simply_edit"
                    />
                </li>

                <li v-else class="flex flex-col">
                    <Note_card_loader class="mb-3" />
                    <Note_card_loader class="mb-3" />
                    <Note_card_loader class="mb-3" />
                    <Note_card_loader class="mb-3" />
                </li>

            </ul>

        </div>
    
        <div style="box-shadow: 0 0 15px #3636364f;" class="bg-[#FFF8F0] h-30 w-full z-50 fixed bottom-0">
            <button @click="create_new_note" class="add-note-btn cursor-pointer flex items-center justify-center absolute right-4 left-4 bottom-8"><div class="add-note-svg"></div></button>
        </div>

    </div>

    <div v-if="if_open_create_tag">

        <div @click="if_open_create_tag = false" class="fixed inset-0 bg-black/50 z-100"></div>

            <section class="flex flex-col gap-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-110">

            <Tags_item
                id="create_tag"
                name="create_tag"
                tag="create_tag"
                :active="false"
            />

            <Tags_item 
                @click="create_tag()" 
                id="create_tag_btn"
                name="create_tag_btn"
                tag="create_tag_btn"
                :active="false"
            />

        </section>

    </div>

</template>

<script setup lang='ts'>

    import { useRouter } from 'vue-router';
    import { onMounted, ref, watch } from 'vue';

    import db from '../assets/ts/database';
    import { notes_parms } from '../assets/ts/use_notes';

    import Danger_card from '../components/Danger_card.vue';
    import Note_card from '../components/Note_card.vue';
    import Note_card_loader from '../components/Note_card_loader.vue';
    import Search_bar from '../components/Search_bar.vue';
    import Tags_item from '../components/Tags_item.vue';
    import Tags_item_loader from '../components/Tags_item_loader.vue';

    const router = useRouter();

    const create_new_note = () => {
        router.push('/edit')
    };

    interface Note {
        id: number
        pinned: boolean
        simply_edit: boolean
        title: string
        content: string
        date: string
        tags: string[]
    };

    const tip: boolean = false;

    const list_notes = ref<Note[]>();

    const if_open_dropdown = ref<boolean>(false);

    const if_open_create_tag = ref<boolean>(false);

    const init_notes = async () => {
        list_notes.value = await db.getAll();
        const sort_notes = list_notes.value.sort((a, b) => {
            if (a.pinned === b.pinned) {
                return a.id - b.id;
            }
                return a.pinned ? -1 : 1;
        });
        list_notes.value = sort_notes;
    }

    const add_tag_filter = (id: number) => {

        notes_parms.value.tags[id].active = !notes_parms.value.tags[id].active;

        const activeTags = notes_parms.value.tags
            .filter(tag => tag.active)
            .map(tag => tag.name);

        if (activeTags.length === 0) {
            list_notes.value = list_notes.value;
            return;
        }

        const notes: Note[] = list_notes.value ?? [];

        list_notes.value = notes.filter(note =>
            note.tags.some(tag => activeTags.includes(tag))
        );
    };

    const create_tag = () => {
        if_open_create_tag.value = true
    }

    onMounted(async () => {
        setTimeout(async () => {
            await init_notes();
        }, 500);
    });

    watch(list_notes, async () => {
        await init_notes()
        console.log("Les notes ont été modifiées, tri en cours...");
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
        background-image: url('../assets/svgs/ellipsis.svg');
        filter: invert(1);
        transition: all 0.3s ease;
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