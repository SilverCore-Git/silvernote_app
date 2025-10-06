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

    <Transition
        enter-active-class="transition-transform duration-500 ease-in-out"
        leave-active-class="transition-transform duration-500 ease-in-out"
        enter-from-class="translate-x-200"
        enter-to-class="translate-x-0"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-200"
    >

        <div
            v-if="open"
            :class="[
                pos === 'fixed'
                    ? 'fixed w-screen h-screen md:h-[90%] md:w-120 md:max-h-[85%] flex flex-col'
                    : 'relative h-screen flex flex-col w-[400px] resize-container group',
                pos === 'fixed'
                    ? open
                        ? 'right-0 inset-y-0 md:bottom-8 md:top-auto md:right-8'
                        : ''
                    : ''

            ]"
        >
        
            <div 
                class="relative z-50 w-full bg-[var(--bg2)] rounded-2xl 
                shadow flex flex-col justify-between h-full resize-handle"
            >

                <header 
                    class="h-15 bg-[var(--btn)] flex justify-between 
                            items-center px-5 text-white flex-row 
                            shadow-[var(--btn)] draggable z-30"
                    :class="pos === 'fixed' ? 'rounded-t-2xl' : ''"
                >

                    <div class="flex justify-center items-center flex-row">
                        <span class="font-bold mr-2 text-xl">SilverAI</span>
                        <div class="round" :class="silverai_active ? 'green' : 'red'"></div>
                    </div>

                    <div
                        class="flex justify-center items-center gap-4"
                    >

                        <div 
                            class="svg ellipsis w-8 h-8 cursor-pointer invert-100" 
                            @click="pos = pos == 'fixed' ? 'relative' : 'fixed'"
                            v-if="[ 'Edit', 'Share' ].includes(route.name as string)"
                        >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4.75C10.9396 4.75 10.0907 5.07796 8.06584 5.88789L5.25737 7.01128C4.24694 7.41545 3.54677 7.69659 3.09295 7.93451C3.0486 7.95776 3.00863 7.97959 2.97267 8C3.00863 8.02041 3.0486 8.04224 3.09295 8.06549C3.54677 8.30341 4.24694 8.58455 5.25737 8.98872L8.06584 10.1121C10.0907 10.922 10.9396 11.25 12 11.25C13.0604 11.25 13.9093 10.922 15.9342 10.1121L18.7426 8.98872C19.7531 8.58455 20.4532 8.30341 20.9071 8.06549C20.9514 8.04224 20.9914 8.02041 21.0273 8C20.9914 7.97959 20.9514 7.95776 20.9071 7.93451C20.4532 7.69659 19.7531 7.41545 18.7426 7.01128L15.9342 5.88789C13.9093 5.07796 13.0604 4.75 12 4.75ZM7.62442 4.4489C9.50121 3.69796 10.6208 3.25 12 3.25C13.3792 3.25 14.4988 3.69796 16.3756 4.4489C16.4138 4.4642 16.4524 4.47962 16.4912 4.49517L19.3451 5.6367C20.2996 6.01851 21.0728 6.32776 21.6035 6.60601C21.8721 6.74683 22.1323 6.90648 22.333 7.09894C22.5392 7.29668 22.75 7.59658 22.75 8C22.75 8.40342 22.5392 8.70332 22.333 8.90106C22.1323 9.09352 21.8721 9.25317 21.6035 9.39399C21.2519 9.57835 20.7938 9.77632 20.247 10C20.7938 10.2237 21.2519 10.4216 21.6035 10.606C21.8721 10.7468 22.1323 10.9065 22.333 11.0989C22.5392 11.2967 22.75 11.5966 22.75 12C22.75 12.4034 22.5392 12.7033 22.333 12.9011C22.1323 13.0935 21.8721 13.2532 21.6035 13.394C21.2519 13.5784 20.7938 13.7763 20.247 14C20.7938 14.2237 21.2519 14.4216 21.6035 14.606C21.8721 14.7468 22.1323 14.9065 22.333 15.0989C22.5392 15.2967 22.75 15.5966 22.75 16C22.75 16.4034 22.5392 16.7033 22.333 16.9011C22.1323 17.0935 21.8721 17.2532 21.6035 17.394C21.0728 17.6722 20.2997 17.9815 19.3451 18.3633L16.4912 19.5048C16.4524 19.5204 16.4138 19.5358 16.3756 19.5511C14.4988 20.302 13.3792 20.75 12 20.75C10.6208 20.75 9.50121 20.302 7.62443 19.5511C7.58619 19.5358 7.54763 19.5204 7.50875 19.5048L4.6549 18.3633C3.70034 17.9815 2.9272 17.6722 2.39647 17.394C2.12786 17.2532 1.86765 17.0935 1.66701 16.9011C1.46085 16.7033 1.25 16.4034 1.25 16C1.25 15.5966 1.46085 15.2967 1.66701 15.0989C1.86765 14.9065 2.12786 14.7468 2.39647 14.606C2.74813 14.4216 3.20621 14.2237 3.75299 14C3.20621 13.7763 2.74813 13.5784 2.39647 13.394C2.12786 13.2532 1.86765 13.0935 1.66701 12.9011C1.46085 12.7033 1.25 12.4034 1.25 12C1.25 11.5966 1.46085 11.2967 1.66701 11.0989C1.86765 10.9065 2.12786 10.7468 2.39647 10.606C2.74813 10.4216 3.20621 10.2237 3.75299 10C3.20621 9.77632 2.74813 9.57835 2.39647 9.39399C2.12786 9.25317 1.86765 9.09352 1.66701 8.90106C1.46085 8.70332 1.25 8.40342 1.25 8C1.25 7.59658 1.46085 7.29668 1.66701 7.09894C1.86765 6.90648 2.12786 6.74683 2.39647 6.60601C2.92721 6.32776 3.70037 6.01851 4.65496 5.63669L7.50875 4.49517C7.54763 4.47962 7.58618 4.4642 7.62442 4.4489ZM5.76613 10.8078L5.25737 11.0113C4.24694 11.4154 3.54677 11.6966 3.09295 11.9345C3.0486 11.9578 3.00863 11.9796 2.97268 12C3.00863 12.0204 3.0486 12.0422 3.09295 12.0655C3.54677 12.3034 4.24694 12.5845 5.25737 12.9887L8.06584 14.1121C10.0907 14.922 10.9396 15.25 12 15.25C13.0604 15.25 13.9093 14.922 15.9342 14.1121L18.7426 12.9887C19.7531 12.5845 20.4532 12.3034 20.9071 12.0655C20.9514 12.0422 20.9914 12.0204 21.0273 12C20.9914 11.9796 20.9514 11.9578 20.9071 11.9345C20.4532 11.6966 19.7531 11.4154 18.7426 11.0113L18.2339 10.8078L16.4912 11.5048C16.4524 11.5204 16.4138 11.5358 16.3756 11.5511C14.4988 12.302 13.3792 12.75 12 12.75C10.6208 12.75 9.50121 12.302 7.62443 11.5511C7.58619 11.5358 7.54763 11.5204 7.50875 11.5048L5.76613 10.8078ZM5.76613 14.8078L5.25737 15.0113C4.24694 15.4154 3.54678 15.6966 3.09295 15.9345C3.0486 15.9578 3.00863 15.9796 2.97268 16C3.00863 16.0204 3.0486 16.0422 3.09295 16.0655C3.54677 16.3034 4.24694 16.5845 5.25737 16.9887L8.06584 18.1121C10.0907 18.922 10.9396 19.25 12 19.25C13.0604 19.25 13.9093 18.922 15.9342 18.1121L18.7426 16.9887C19.7531 16.5845 20.4532 16.3034 20.9071 16.0655C20.9514 16.0422 20.9914 16.0204 21.0273 16C20.9914 15.9796 20.9514 15.9578 20.9071 15.9345C20.4532 15.6966 19.7531 15.4154 18.7426 15.0113L18.2339 14.8078L16.4912 15.5048C16.4524 15.5204 16.4138 15.5358 16.3756 15.5511C14.4988 16.302 13.3792 16.75 12 16.75C10.6208 16.75 9.50121 16.302 7.62443 15.5511C7.58619 15.5358 7.54763 15.5204 7.50875 15.5048L5.76613 14.8078Z" fill="#1C274C"/>
                            </svg>
                        </div>

                        <div class="svg cross w-10 h-10 cursor-pointer" @click="open = false"></div>

                    </div>

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

                    </ul>

                </section>


                <footer 
                    class="h-15 flex justify-between items-center flex-row"
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

    </Transition>
    
</template>

<script lang="ts" setup>

import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MessageDubble from './MessageDubble.vue';
import { useUser } from '@clerk/vue';
import db from '@/assets/ts/database/database';
import { api_url } from '@/assets/ts/backend_link';
import { io, Socket } from 'socket.io-client';
import type { Note } from '@/assets/ts/type';

const props = defineProps<{
    visible?: boolean;
}>()

const { user } = useUser();
const route = useRoute();
const router = useRouter();

const max_LenghtOfMessage: number = 150;
const open = ref<boolean>(props?.visible || false);

const pk_ai_api: string = import.meta.env.VITE_SECRET_AI_API_KEY;
const loading = ref<boolean>(false);
const first_loaded = ref<boolean>(false);
const AllMessage = ref<{ origin: 'ai' | 'user' | 'error', text: string }[]>([]);
const message = ref<string>("");
const lengthOfMessage = ref<number>(max_LenghtOfMessage);
const session_id = ref<string>('');
const user_id = ref<string | undefined>('');
const silverai_active = ref<boolean>(false);
const pos = ref<'fixed' | 'relative'>('fixed');

let socket_is_connect: boolean = false;
let socket: Socket;

watch(() => message.value, () => lengthOfMessage.value = max_LenghtOfMessage - message.value.length)

const add_message = (content: string) => {
    
    //comands 
    if (content == '/clear') {
        loading.value = false;
        return AllMessage.value = [];
    }
    if (content == '/test') {
        content = 'Fait un long message de test avec tout type de markdown.'
    }
    if (content == '/loader') {
        add_message('');
    }
    if (content == '/open 4545') {
        silverai_active.value = true;
        return;
    }
    if (content == '/close 4545') {
        close();
    }

    if (content && content !== '') {
        AllMessage.value.push({ origin: 'user', text: content });
        scroll_to_bottom();
        if (!silverai_active.value) {
            return add_error("Jeremy n'est actuellement pas en ligne.")
        }
        loading.value = true;
        send(content)
    }
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

const initResize = () => {
    const handle = document.querySelector<HTMLElement>('.resize-handle');
    const container = document.querySelector<HTMLElement>('.group');
    
    if (!handle || !container) return;

    let startWidth = 0;
    let startX = 0;
    let isResizing = false;

    const startResize = (e: MouseEvent) => {
        if (pos.value === 'fixed') return;

        const handleRect = handle.getBoundingClientRect();
        const isInResizeZone = e.clientX >= handleRect.left - 8 && e.clientX <= handleRect.left + 8;
        
        if (!isInResizeZone) return;
        
        isResizing = true;
        startWidth = container.offsetWidth;
        startX = e.clientX;
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        e.preventDefault();
    };

    const resize = (e: MouseEvent) => {
        if (!isResizing) return;
        const diff = e.clientX - startX;
        const newWidth = Math.max(300, Math.min(1000, startWidth - diff));
        container.style.width = `${newWidth}px`;
    };

    const stopResize = () => {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    };

    handle.addEventListener('mousedown', startResize);
}



const send = async (prompt: string): Promise<void> => {

    loading.value = true;

    const newMessage: { origin: 'ai' | 'user' | 'error', text: string } = reactive({ origin: "ai", text: "" });
    AllMessage.value.push(newMessage);
    scroll_to_bottom();

    try {

        let note: Note | undefined = undefined;

        if (route.query.id) {
            note = await db.getNote(Number(route.params.id));
        }
        
        const response = await fetch(`${api_url}/api/ai/send`, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                "authorization": pk_ai_api
            },
            body: JSON.stringify({ 
                uuid: session_id.value, 
                message: prompt, 
                note: note?.uuid
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("text/event-stream")) {
            throw new Error("Invalid response format - expected event stream");
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("No readable stream available");
        }

        const decoder = new TextDecoder();

        if (!reader) {
            add_error("Pas de flux reçu");
            return;
        }

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            try {
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n").filter(line => line.startsWith("data:"));

                for (let line of lines) {

                    line = line.replace("data: ", "");
                    if (line === "[DONE]") continue;
                    if (line === ' ') continue
                    line = line
                    newMessage.text += line;
                    scroll_to_bottom();

                    newMessage.text = newMessage.text.replace(/#34/g, "\n")
                                                    .replace("#34", "\n");

                    if (newMessage.text.startsWith('[CMD]')) {

                        const message = newMessage.text;
                        const regex = /\[CMD\]\s+UUID:\s*([^\s]+)\s+CONTENT:\s*(.+)/;
                        const match = message.match(regex);

                        if (match) {

                            const uuid = match[1];
                            const content = match[2];

                            if (!socket_is_connect) wsConnect(uuid);
                            wsSend(uuid, content)

                        }

                    }

                }
            } catch (err: any) {
                loading.value = false;
                add_error(err.message || "Erreur inconnue");
                AllMessage.value = AllMessage.value.filter(msg => msg !== newMessage);
            }
        }

        loading.value = false;

    } catch (err: any) {
        add_error(err.message || "Erreur inconnue");
    }

};

const wsConnect = (uuid: string) => {

    socket = io(api_url, { path: "/socket.io/" });

    socket.on('connect', () => {
        console.log('WebSocket connecté !');
        socket_is_connect = true;
        socket.emit('join_share', { uuid: uuid });
    });

    socket.on('disconnect', () => {
        console.log('WebSocket déconnecté !');
    });

}

const wsSend = (uuid: string, content: string) => {

    socket.emit('edit_note', { 
        uuid: uuid,
        content: content
    })

}

const close = async () => {

    // fermer la session
    const res = await fetch(`${api_url}/api/ai/close`, {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json",
            "authorization": pk_ai_api
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
                    "authorization": pk_ai_api
                },
                body: JSON.stringify({ 
                    user: user.value
                })
            }).then(res => res.json())

            if (res.error) {
                silverai_active.value = false;
                add_error(res.message);
                first_loaded.value = true;
                return clearInterval(int)
            }

            if (res.success) {
                //silverai_active.value = true; // décomenter pour activé par default j
                session_id.value = res.session.uuid;
                user_id.value = user.value?.id;
                first_loaded.value = true;
                return clearInterval(int)
            }

        //}

    }, 1000)

    if (route.query.chatbot === 'relative' || route.query.chatbot === 'fixed') {
        open.value = true;
        pos.value = route.query.chatbot as 'relative' | 'fixed';
    }

}

onUnmounted(() => close());
onMounted(() => {
    Open();
});


watch(() => pos.value, (newVal) => {
    if (newVal === 'relative') {
        setTimeout(() => {
            console.log('Initializing resize...');
            initResize();
        }, 100);
    }
    if (newVal === 'fixed') {
        const container = document.querySelector<HTMLElement>('.group');
        if (!container) return;
        container.classList = 'w-screen md:w-120';
    }
    router.push({
        query: {
            ...route.query,
            chatbot: pos.value
        }
    });
});
watch(() => open.value, () => {
    if (pos.value === 'relative') {
        setTimeout(() => {
            console.log('Initializing resize...');
            initResize();
        }, 100);
    }
    router.push({
        query: open.value 
            ? {
                ...route.query,
                chatbot: pos.value
            }
            : {
                ...route.query,
                chatbot: undefined
            }
    });
})
watch(() => route.name, () => {
    if (![ 'Edit', 'Share' ].includes(route.name as string))
    {
        pos.value = 'fixed';
    }
})

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

.group:has(.resize-handle) {
    position: relative;
}

.group .resize-handle {
    position: relative !important;
}

.group .resize-handle::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 0;
    width: 16px;
    height: 100%;
    cursor: default;
    z-index: 100;
}

.group .resize-handle:hover::before {
    cursor: ew-resize;
    background-color: rgba(0, 0, 0, 0.1);
}

.group .resize-handle:hover::before {
    background-color: var(--btn);
    opacity: 0.2;
}

</style>