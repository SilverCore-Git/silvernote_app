<template>
    <div class="fixed right-8 bottom-8 w-120 flex flex-col max-h-[85%]">
    
        <div class="relative z-50 w-full bg-[var(--bg2)] rounded-2xl shadow flex flex-col justify-between h-full">

            <header class="h-15 bg-[#F28C28] rounded-t-2xl
                            flex justify-between items-center px-5 text-white flex-row 
                            shadow-orange-400 shadow-sm draggable z-30"
            >

                <div class="flex justify-center items-center flex-row">
                    <span class="font-bold mr-2 text-xl">Jeremy</span>
                    <div class="round"></div>
                </div>

                <div class="svg cross w-10 h-10 cursor-pointer" @click="close"></div>

            </header>

            <section class="overflow-y-auto h-150 flex flex-col flex-grow z-20 px-3 py-2">

                <ul class="space-y-2 w-full flex flex-col justify-end">
                    <li
                        v-for="(message, index) in AllMessage"
                        :class="message.origin == 'ai' ? 'mr-0' : message.origin == 'error' ? 'mr-[47%]' : 'ml-[47%]'"
                        :id="`message-${index}`"
                    >
                        <MessageDubble
                            :origin="message.origin"
                            :text="message.text"
                        />
                    </li>

                    <Loader v-if="loading" class="absolute bottom-2 left-0" />

                </ul>

            </section>


            <footer 
                class="h-15 rounded-b-2xl flex justify-between items-center flex-row"
            >

                <input 
                    type="text" 
                    name="message" 
                    id="message"
                    :maxlength="max_LenghtOfMessage"
                    placeholder="Envoyer un message"
                    v-model="message"
                    class=" outline-0 h-full w-[70%] pl-5"
                    @keyup.enter="add_message(message); message = ''"
                >

                <span :class="lengthOfMessage < 11 ? 'text-red-500' : ''">{{ lengthOfMessage }}</span>

                <div @click="add_message(message); message = ''" class="svg send w-10 h-10 mr-5 cursor-pointer"></div>

            </footer>

        </div>

    </div>

</template>

<script lang="ts" setup>

import { onMounted, onUnmounted, ref, watch } from 'vue';
import MessageDubble from './MessageDubble.vue';
import Loader from './Loader.vue';
import { useUser } from '@clerk/vue';
import db from '@/assets/ts/database';

const { isLoaded } = useUser();
const { user } = useUser();

const emit = defineEmits<{
  (e: 'close'): void
}>()

const max_LenghtOfMessage: number = 150;

const loading = ref<boolean>(false);
const AllMessage = ref<{ origin: 'ai' | 'user' | 'error', text: string }[]>([]);
const message = ref<string>("");
const lengthOfMessage = ref<number>(max_LenghtOfMessage);
const session_id = ref<string>('');
const user_id = ref<string | undefined>('');

watch(() => message.value, () => lengthOfMessage.value = max_LenghtOfMessage - message.value.length)

const add_message = (content: string) => {
    
    //comands 
    if (content == '/clear') {
        loading.value = false;
        return AllMessage.value = [];
    }

    if (content && content !== '') {
        AllMessage.value.push({ origin: 'user', text: content });
        scroll_to_bottom();
        //loading.value = true;
        //send(content)
    }
}

const add_response = (content: string) => {
    loading.value = false;
    AllMessage.value.push({ origin: 'ai', text: content });
    scroll_to_bottom();
}

const add_error = (content: string) => {
    loading.value = false;
    AllMessage.value.push({ origin: 'error', text: `error: ${content}` });
    scroll_to_bottom();
}

const scroll_to_bottom = () => {
    const container = document.querySelector<HTMLElement>('section');
    if (container) container.scrollTop = container.scrollHeight;
}

const send = async (prompt: string) => {

    const res = await fetch('http://localhost:3000/api/ai/send', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid: session_id.value, message: prompt })
    }).then(res => res.json())

    if (res.error) {
        return add_error(res.message);
    }

    if (res.success) {
        add_response(res.output)
    }

}

const close = async () => {

    // fermer la session
    const res = await fetch('http://localhost:3000/api/ai/close', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: user_id.value, uuid: session_id.value })
    }).then(res => res.json())

    if (res.error) return console.error(res.message);

    emit('close');

}

onMounted(async () => {

    const loaded = isLoaded;
    console.log(loaded.value);

    // créer la session
    const res = await fetch('http://localhost:3000/api/ai/create', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            user: user.value,
            notes: await db.getAll('notes'),
            tags: await db.getAll('tags')
        })
    }).then(res => res.json())

    if (res.error) {
        return add_error(res.message);
    }

    if (res.success) {
        session_id.value = res.session.uuid;
        user_id.value = user.value?.id;
        return add_response('Bonjour je suis Jeremy le chatbot de silvernote, je peut vous aider sur tout les sujet mais spécialement sur vos notes !')
    }

})

onUnmounted(() => close())

</script>

<style scoped>

.svg {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.send {
    background-image: url('../../assets/svgs/send.svg');
    filter: contrast(20%);
    transition: all 0.2s;
}

.send:hover {
    filter: contrast(50%);
}

.cross {
    background-image: url('../../assets/svgs/cross.svg');
    filter: invert(1);
}

.round {
  width: 10px;
  height: 10px;
  background-color: #39FF14;
  border-radius: 50%;
  box-shadow: 0 0 15px #39FF14;
}

.shadow {
    box-shadow: 0 0 8px var(--shadow);
}

footer {
    border: 2px solid transparent;
    border-top: 2px solid rgb(180, 180, 180);
}

footer:has(input:focus) {
    border: 2px solid var(--btn);
    border-top: 2px solid var(--btn);
}


</style>