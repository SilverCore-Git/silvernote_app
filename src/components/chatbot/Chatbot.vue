<template>
    
    <Dragable :initx="1500" :inity="-650">

        <div class="relative resize overflow-auto z-50 w-100 h-140 bg-[var(--bg2)] rounded-2xl shadow">

            <header class="absolute h-[10%] top-0 inset-x-0 bg-[#F28C28] rounded-t-2xl
                            flex justify-between items-center px-5 text-white flex-row 
                            shadow-orange-400 shadow-sm draggable"
            >

                <div class="flex justify-center items-center flex-row">
                    <span class="font-bold mr-2 text-xl">Jeremy</span>
                    <div class="round"></div>
                </div>

                <div class="svg cross w-10 h-10 cursor-pointer" @click="emit('close')"></div>

            </header>


            <section class="absolute inset-y-[10%] inset-x-3 overflow-y-auto
                            flex justify-between
            ">

                <ul class="space-y-2 w-full relative">
                    <li
                        v-for="(message, index) in AllMessage"
                        :class="message.origin == 'ai' ? 'mr-[47%]' : 'ml-[47%]'"
                        :id="`message-${index}`"
                    >
                        <MessageDubble
                            :origin="message.origin"
                            :text="message.text"
                        />
                    </li>
                    
                    <Loader v-if="loading" class=" absolute bottom-2 left-0" />

                </ul>

            </section>


            <footer 
                class="absolute h-[10%] bottom-0 inset-x-0 
                        border-t-1 border-gray-400
                        rounded-b-2xl flex justify-between items-center flex-row
                "
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

    </Dragable>

</template>

<script lang="ts" setup>

import { ref, watch } from 'vue';
import MessageDubble from './MessageDubble.vue';
import Loader from './Loader.vue';
import Dragable from '../Dragable.vue';


const emit = defineEmits<{
  (e: 'close'): void
}>()


const max_LenghtOfMessage: number = 150;

const loading = ref<boolean>(false);
const AllMessage = ref<{ origin: 'ai' | 'user', text: string }[]>([]);
const message = ref<string>("");
const lengthOfMessage = ref<number>(max_LenghtOfMessage);

watch(() => message.value, () => lengthOfMessage.value = max_LenghtOfMessage - message.value.length)

const add_message = (content: string) => {
    if (content && content !== '') {
        AllMessage.value.push({ origin: 'user', text: content });
        scroll_to_bottom();
        loading.value = true;
        send(content)
    }
}

const add_response = (content: string) => {
    loading.value = false;
    AllMessage.value.push({ origin: 'ai', text: content });
    scroll_to_bottom();
}

const scroll_to_bottom = () => {
    const container = document.querySelector<HTMLElement>('section');
    if (container) container.scrollTop = container.scrollHeight;
}

const send = async (prompt: string) => {

    const res = await fetch('http://localhost:3000/api/ai/prompt', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt })
    }).then(res => res.json())

    add_response(res.output || 'Une erreur est survenue.')

}

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
    box-shadow: 0 0 8px #33333346;
}

</style>