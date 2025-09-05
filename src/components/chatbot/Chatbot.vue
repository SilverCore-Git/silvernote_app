<template>

    <div 
        v-if="first_loaded"
        @click="open = !open" 
        :class="!open ? 'bottom-6 right-6' : '-bottom-9 -right-9'"
        class=" fixed  w-15 h-15 bg-[var(--btn)] p-2 rounded-full cursor-pointer hover"
    >
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            style="filter: invert(1);"
            viewBox="0 0 621.000000 623.000000"
            preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,623.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
                <path d="M3930 5224 c-6 -14 -10 -33 -10 -42 0 -9 -9 -48 -21 -87 -55 -184
                -73 -241 -79 -250 -4 -5 -10 -23 -14 -40 -15 -65 -130 -289 -182 -355 -6 -8
                -52 -55 -101 -105 -90 -91 -230 -186 -315 -214 -21 -7 -40 -17 -43 -22 -4 -5
                -13 -9 -22 -9 -9 0 -34 -8 -57 -19 -23 -10 -75 -29 -116 -41 -41 -13 -100 -31
                -130 -41 -30 -9 -70 -20 -89 -23 -47 -8 -151 -47 -151 -56 0 -9 36 -20 65 -20
                11 0 52 -9 90 -21 39 -11 102 -30 140 -41 39 -12 91 -29 117 -39 26 -11 54
                -19 62 -19 9 0 30 -9 48 -20 18 -11 43 -20 54 -20 12 0 27 -6 33 -14 7 -8 24
                -17 38 -21 15 -3 38 -15 51 -26 14 -10 29 -19 34 -19 6 0 20 -8 33 -17 12 -10
                33 -25 45 -33 50 -33 137 -110 167 -147 36 -46 143 -201 143 -209 0 -7 47
                -111 66 -146 8 -14 14 -32 14 -40 1 -7 9 -31 20 -53 11 -22 19 -47 20 -56 0
                -9 7 -33 15 -53 8 -19 20 -59 26 -88 6 -29 15 -58 19 -63 5 -6 14 -41 20 -78
                10 -53 16 -67 30 -67 24 0 37 18 45 65 3 22 15 67 25 100 10 33 28 94 40 135
                26 87 99 278 115 300 6 8 17 28 23 43 27 64 110 177 181 247 71 71 204 170
                228 170 6 0 16 6 22 14 7 8 25 18 41 21 16 3 34 13 41 21 6 8 19 14 28 14 9 0
                33 9 54 20 20 11 45 20 55 20 9 0 34 9 55 20 20 11 47 20 59 20 13 1 41 9 63
                20 22 11 51 19 65 20 14 0 49 9 78 20 29 11 65 20 80 20 36 0 72 10 72 21 0 7
                -61 27 -245 80 -70 20 -216 68 -287 95 -67 25 -192 89 -253 129 -199 132 -328
                309 -433 595 -38 104 -100 312 -107 362 -6 37 -27 68 -46 68 -5 0 -14 -12 -19
                -26z"/>
                <path d="M4764 4928 c-32 -65 -78 -115 -124 -134 -62 -26 -67 -59 -12 -73 46
                -13 94 -60 130 -129 15 -28 31 -52 37 -54 5 -2 15 18 23 44 16 57 79 123 133
                140 55 16 51 45 -11 72 -61 27 -112 86 -125 144 -10 49 -22 47 -51 -10z"/>
                <path d="M1930 4616 c-213 -56 -348 -189 -398 -391 -16 -64 -17 -166 -17
                -1195 0 -1029 1 -1131 17 -1195 49 -199 210 -359 397 -395 73 -14 2308 -14
                2382 0 139 26 293 147 357 282 61 126 63 152 60 895 -2 369 -6 674 -9 678 -10
                9 -157 13 -171 4 -10 -7 -14 -155 -18 -706 -4 -539 -9 -707 -19 -737 -38 -116
                -139 -204 -255 -225 -93 -17 -2202 -14 -2281 3 -119 25 -213 115 -249 238 -14
                50 -16 168 -16 1156 0 1070 1 1102 20 1164 24 79 64 136 124 178 99 68 64 64
                781 70 l650 5 0 95 0 95 -635 2 c-629 2 -636 2 -720 -21z"/>
                <path d="M2776 3283 c-68 -224 -121 -325 -215 -411 -54 -49 -54 -49 -138 -91
                -88 -44 -149 -66 -243 -87 -35 -8 -66 -17 -68 -19 -8 -8 88 -56 129 -64 58
                -13 148 -46 162 -60 6 -6 15 -11 21 -11 5 0 28 -12 50 -27 161 -107 217 -194
                302 -470 15 -50 31 -90 35 -87 4 2 10 19 14 37 9 45 42 150 72 227 48 123 130
                226 228 287 37 24 142 73 154 73 6 0 22 6 34 14 12 8 39 17 61 21 42 7 126 45
                126 56 0 4 -26 13 -57 19 -32 6 -72 18 -90 26 -17 8 -36 14 -42 14 -23 0 -137
                53 -191 88 -107 70 -168 150 -228 297 -28 70 -60 173 -68 218 -3 20 -10 37
                -14 37 -4 0 -20 -39 -34 -87z"/>
            </g>
        </svg>
    </div>

    <div
        :class="open ? 'right-0 inset-y-0 md:bottom-8 md:top-auto md:right-8' : '-bottom-200 -right-200'"
        class="
            fixed w-screen h-screen md:h-[90%]
            md:w-120 md:max-h-[85%] 
            flex flex-col transition-all transform duration-500 ease-in-out
        "
    >
    
        <div 
            class="relative z-50 w-full bg-[var(--bg2)] rounded-2xl shadow flex flex-col justify-between h-full"
        >

            <header class="h-15 bg-[var(--btn)] rounded-t-2xl
                            flex justify-between items-center px-5 text-white flex-row 
                            shadow-[var(--btn)] draggable z-30"
            >

                <div class="flex justify-center items-center flex-row">
                    <span class="font-bold mr-2 text-xl">Jeremy</span>
                    <div class="round" :class="jeremy_active ? 'green' : 'red'"></div>
                </div>

                <div class="svg cross w-10 h-10 cursor-pointer" @click="open = false"></div>

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
                    @keyup.enter="add_message(message); message = ''; "
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
import { api_url } from '@/assets/ts/backend_link';
//import { loaded } from '@/assets/ts/utils';

const { user } = useUser();

const max_LenghtOfMessage: number = 150;
const open = ref<boolean>(false);

const loading = ref<boolean>(false);
const first_loaded = ref<boolean>(false);
const AllMessage = ref<{ origin: 'ai' | 'user' | 'error', text: string }[]>([]);
const message = ref<string>("");
const lengthOfMessage = ref<number>(max_LenghtOfMessage);
const session_id = ref<string>('');
const user_id = ref<string | undefined>('');
const jeremy_active = ref<boolean>(false);

watch(() => message.value, () => lengthOfMessage.value = max_LenghtOfMessage - message.value.length)

let access: boolean = false;

const add_message = (content: string) => {
    
    //comands 
    if (content == '/clear') {
        loading.value = false;
        return AllMessage.value = [];
    }
    if (content == '/open 4545') {
        access = true;
        jeremy_active.value = true;
        return;
    }
    if (content == '/close 4545') {
        close();
    }

    if (content && content !== '') {
        AllMessage.value.push({ origin: 'user', text: content });
        scroll_to_bottom();
        if (!jeremy_active.value) {
            return add_error("Jeremy n'est actuellement pas en ligne.")
        }
        loading.value = true;
        send(content)
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

    if (!access) return;

    const res = await fetch(`${api_url}/api/ai/send`, {
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
    const res = await fetch(`${api_url}/api/ai/close`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: user_id.value, uuid: session_id.value })
    }).then(res => res.json())

    if (res.error) return console.error(res.message);

}


const Open = (): void => {

    const int = setInterval(async () => {

        //if (loaded.value) {

            // créer la session
            const res = await fetch(`${api_url}/api/ai/create`, {
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
                jeremy_active.value = false;
                add_error(res.message);
                first_loaded.value = true;
                return clearInterval(int)
            }

            if (res.success) {
                //jeremy_active.value = true;
                session_id.value = res.session.uuid;
                user_id.value = user.value?.id;
                add_error("Jeremy n'est actuellement pas en ligne.")
                //if (AllMessage.value.length == 0) add_response('Bonjour je suis Jeremy le chatbot de silvernote, je peux vous aider sur tous les sujets mais spécialement sur vos notes !')
                first_loaded.value = true;
                return clearInterval(int)
            }

        //}

    }, 1000);

}

onUnmounted(() => close());
onMounted(() => Open());

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
    border-radius: 50%;
}

.red {
    background-color: #ff1414;
    box-shadow: 0 0 15px #ff1414;
}

.green {
    background-color: #39FF14;
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

.hover {
    transition: all 0.3s;
}

.hover:hover {
    transform: scale(1.1);
} 

</style>