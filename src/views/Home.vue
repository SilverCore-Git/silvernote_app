
<template>

    <header class="mb-5 top-0 left-0 w-full h-14 text-2xl bg-[#F28C28] text-white font-bold flex items-center justify-center">
        <h1>SilverNote</h1>
    </header>

    <div>

        <Danger_card class="mb-6" title="Tip of the week" content="You can create a new note with +" />

        <div class="overflow-y-auto h-[50vh]">

            <ul class="flex flex-col" v-for="(note, index) in list_notes" :key="index">
                <li><Note_card class="mb-3" :title="note.title" :content="note.content" :date="note.date" /></li>
            </ul>

        </div>
    
        <button class="add-note-btn cursor-pointer flex items-center justify-center absolute right-4 left-4 bottom-8"><div class="add-note-svg"></div></button>

    </div>


</template>

<script setup lang='ts'>
    import Danger_card from '../components/Danger_card.vue';
    import Note_card from '../components/Note_card.vue';

    type Note = {
        title: string,
        content: string,
        date: string
    }

    const list_notes: Note[] = [
        { title: "Ma super note", content: 'aaaaah', date: '20 Mai 2025' }, 
        { title: "Ma super note 2", content: 'aaaaah 2', date: '22 Mai 2025' }, 
        { title: "Ma super note 3", content: 'aaaaah 3', date: '20 Mai 2024' }, 
        { title: "Ma super note", content: 'aaaaah', date: '20 Mai 2025' }, 
        { title: "Ma super note 2", content: 'aaaaah 2', date: '22 Mai 2025' }, 
        { title: "Ma super note 3", content: 'aaaaah 3', date: '20 Mai 2024' }, 
        { title: "Ma super note", content: 'aaaaah', date: '20 Mai 2025' }, 
        { title: "Ma super note 2", content: 'aaaaah 2', date: '22 Mai 2025' }, 
        { title: "Ma super note 3", content: 'aaaaah 3', date: '20 Mai 2024' }
    ];

</script>

<style scoped>

    .add-note-btn {
        background-color: #F28C28;
        border-radius: 15px;
        height: 60px;
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