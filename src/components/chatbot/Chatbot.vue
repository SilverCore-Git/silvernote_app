<template>

    <div
        v-if="fullscreen"
        class="fixed top-4 left-4 z-50"
    >
        <BackBtn />
    </div>

    <div
        v-if="!fullscreen && first_loaded"
        v-tooltip="'SilverIA'"
        @click="isMobile ? router.push('/silveria') : open = !open" 
        :class="[
            isMobile
                ? !open ? 'bottom-6 left-6' : '-bottom-9 -left-9'
                : !open ? 'bottom-6 right-6' : '-bottom-9 -right-9'
        ]"
        class="fixed w-16 h-16 p-2 rounded-full cursor-pointer hover"
        style="background: linear-gradient(135deg, #ff5e62 0%, var(--btn) 100%);"
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
            class="dropdown flex flex-col justify-between"
            :class="
                fullscreen 
                    ? `fixed inset-x-(--mrl) inset-y-4
                        z-50 bg-(--bg2) p-0`
                    : isPhone 
                        ?
                            `
                                fixed inset-0 p-0
                                bg-(--bg2) z-50
                            `
                        :
                            `
                                fixed inset-y-0 right-0 group
                                bg-(--bg2) z-50 m-6 p-0
                            `
            "
        >

            <div class="resize-handle-bar"></div>

                <header 
                    class="h-15 flex justify-between border border-(--btn)
                            items-center px-5 text-white flex-row 
                            shadow-(--btn)s draggable z-30 rounded-t-xl
                    "
                    style="background: linear-gradient(135deg, #ff5e62 0%, var(--btn) 100%);"
                >

                    <div
                        v-if="fullscreen && isPhone"
                        class="flex justify-center items-center relative"
                    >
                        <BackBtn :white="true" />
                    </div>

                    <div class="flex justify-center items-center flex-row gap-2">
                        <img src="../../assets/img/SilverIA.webp" class="w-10 h-10" />
                        <span class="font-bold text-xl">SilverIA</span>
                        <div class="round" :class="silverIA_active ? 'green' : 'red'"></div>
                    </div>
                    <div
                        v-if="!fullscreen"
                        class="flex justify-center items-center gap-2"
                    >

                        <div class="svg open-anyware w-6 h-6 cursor-pointer" @click="router.push('/silveria')"></div>
                        <div class="svg cross w-10 h-10 cursor-pointer" @click="open = false"></div>

                    </div>

                </header>

                <section 
                    ref="messagesContainer"
                    class="overflow-y-auto h-150 flex flex-col grow z-20 px-3 py-2 relative"
                >

                    <ul class="space-y-2 w-full flex flex-col justify-end">
                        <li
                            v-for="(message, index) in AllMessage"
                            :class="message.origin == 'ai' ? 'mr-0' : message.origin == 'error' ? 'mr-[47%]' : 'ml-[47%]'"
                            :id="`message-${index}`"
                        >
                            <MessageDubble
                                :origin="message.origin"
                                :text="message.text"
                                @scroll-to-bottom="scrollToBottom"
                            />
                        </li>

                    </ul>

                    <!-- Bouton scroll to bottom -->
                    <Transition name="fade">
                        <div class="sticky bottom-2 inset-x-0 flex justify-center items-center font-extrabold">
                            <button 
                                v-if="!isAtBottom && AllMessage.length > 0" 
                                @click="scrollToBottom(true)"
                                class="scroll-to-bottom-btn bi bi-arrow-down"
                            ></button>
                        </div>
                    </Transition>

                </section>


                <footer 
                    class=" flex justify-between items-end flex-row rounded-b-xl p-2"
                >
                    <textarea
                        ref="messageInput"
                        name="message"
                        id="message"
                        placeholder="Envoyer un message"
                        v-model="message"
                        :maxlength="max_LenghtOfMessage"
                        @input="autoResize"
                        @keyup.enter.prevent="handleEnter"
                        class="
                            resize-none overflow-y-auto max-h-40 outline-0 
                            w-[70%] bg-transparent px-3 py-2 rounded-md 
                            text-base transition-all duration-150
                        "
                        :class="lengthOfMessage < 20 ? 'w-[70%]' : 'w-[90%]'"
                        rows="1"
                    ></textarea>

                    <span
                        v-if="lengthOfMessage < 20"
                        :class="lengthOfMessage < 11 ? 'text-red-500' : 'text-gray-500'"
                        class="text-sm"
                    >
                        {{ lengthOfMessage }}
                    </span>

                    <div 
                        @click="add_message(message); message = ''; resetHeight();" 
                        class="svg send w-10 h-10 mr-5 cursor-pointer hover:scale-110 transition-transform"
                    ></div>
                </footer>

            </div>

    </Transition>
    
</template>

<script lang="ts" setup>

import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MessageDubble from './MessageDubble.vue';
import { useUser } from '@clerk/vue';
import db from '@/assets/ts/database/database';
import { api_url } from '@/assets/ts/backend_link';
import type { Note } from '@/assets/ts/type';
import BackBtn from '../backBtn.vue';
import isMobile from '@/assets/ts/utils/isMobile';

const props = defineProps<{
    visible?: boolean;
    fullscreen?: boolean;
}>()

const { user } = useUser();
const route = useRoute();
const router = useRouter();

const max_LenghtOfMessage: number = 130000;
const open = ref<boolean>(props.visible || false);

const loading = ref<boolean>(false);
const first_loaded = ref<boolean>(false);
const AllMessage = ref<{ origin: 'ai' | 'user' | 'error', text: string }[]>([]);
const message = ref<string>("");
const lengthOfMessage = ref<number>(max_LenghtOfMessage);
const session_id = ref<string>('');
const user_id = ref<string | undefined>('');
const silverIA_active = ref<boolean>(true);
const pos = ref<'fixed' | 'relative'>('fixed');
const messageInput = ref<HTMLTextAreaElement | null>(null)
const isPhone = ref<boolean>(props.fullscreen || false);
const screen_w = ref<number>(window.innerWidth);

const updateSize = () => {
  screen_w.value = window.innerWidth;
};

// Refs pour le scroll intelligent
const messagesContainer = ref<HTMLElement | null>(null);
const isAtBottom = ref<boolean>(true);
const shouldAutoScroll = ref<boolean>(true);

watch(() => message.value, () => lengthOfMessage.value = max_LenghtOfMessage - message.value.length);

const handleEnter = (e: any) => {
  if (e.shiftKey) {
    // SHIFT + ENTER → nouvelle ligne
    message.value += "\n";
    return;
  }

  // ENTER → envoyer le message
  add_message(message.value);
  message.value = "";
  resetHeight();
}


// Vérifier si on est en bas
const checkIfAtBottom = () => {
    if (!messagesContainer.value) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
    const threshold = 100;
    
    isAtBottom.value = scrollHeight - scrollTop - clientHeight < threshold;
    shouldAutoScroll.value = isAtBottom.value;
};

const autoResize = () => {
  const el = messageInput.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

const resetHeight = () => {
  const el = messageInput.value
  if (!el) return
  el.style.height = 'auto'
}

// Fonction de scroll améliorée
const scrollToBottom = (force = false) => {
    nextTick(() => {
        if (!messagesContainer.value) return;
        
        // Force scroll ou scroll seulement si déjà en bas
        if (force || shouldAutoScroll.value) {
            messagesContainer.value.scrollTo({
                top: messagesContainer.value.scrollHeight,
                behavior: 'smooth'
            });
            
            // Mettre à jour isAtBottom après le scroll
            setTimeout(() => {
                isAtBottom.value = true;
                shouldAutoScroll.value = true;
            }, 300);
        }
    });
};

// Observer le scroll
watch(() => messagesContainer.value, (newVal) => {
    if (newVal) {
        newVal.addEventListener('scroll', checkIfAtBottom);
    }
}, { immediate: true });

onUnmounted(() => {
    if (messagesContainer.value) {
        messagesContainer.value.removeEventListener('scroll', checkIfAtBottom);
    }
});

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
        silverIA_active.value = true;
        return;
    }
    if (content == '/close 4545') {
        close();
    }

    if (content && content !== '') {
        AllMessage.value.push({ origin: 'user', text: content });
        scrollToBottom(true); // Force scroll pour les messages utilisateur
        if (!silverIA_active.value) {
            return add_error("Jeremy n'est actuellement pas en ligne.")
        }
        loading.value = true;
        send(content)
    }
}

const add_error = (content: string) => {
    loading.value = false;
    AllMessage.value.push({ origin: 'error', text: `error: ${content}` });
    scrollToBottom();
}

const initResize = () => {

    const maxW = window.innerWidth * 0.76;
    const minW = 300;

    nextTick(() => {
        
        const handle = document.querySelector<HTMLElement>('.resize-handle-bar');
        const container = document.querySelector<HTMLElement>('.group');
        if (!handle || !container) return;

        let startWidth = 0;
        let startX = 0;
        let isResizing = false;

        const startResize = (e: MouseEvent) => {
            isResizing = true;
            startWidth = container.offsetWidth;
            startX = e.clientX;
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        };

        const resize = (e: MouseEvent) => {
            if (!isResizing) return;
            const diff = startX - e.clientX;
            const newWidth = Math.min(Math.max(minW, startWidth + diff), maxW);
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
        onUnmounted(() => handle.removeEventListener('mousedown', startResize));
    });
};


const send = async (prompt: string): Promise<void> => {

    loading.value = true;

    const newMessage: { origin: 'ai' | 'user' | 'error', text: string } = reactive({ origin: "ai", text: "" });
    AllMessage.value.push(newMessage);
    scrollToBottom();

    try {

        let note: Note | undefined = undefined;

        if (route.params.id) {
            note = await db.getNote(Number(route.params.id));
        } else if (route.params.uuid) {
            note!.uuid = String(route.params.uuid);
        }
        
        const response = await fetch(`${api_url}/api/ai/send`, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                uuid: session_id.value, 
                message: prompt, 
                note: note?.uuid
            })
        });

        if (!response.ok) {
            loading.value = false;
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("text/event-stream")) {
            loading.value = false;
            throw new Error("Invalid response format - expected event stream");
        }

        const reader = response.body?.getReader();
        if (!reader) {
            loading.value = false;
            throw new Error("No readable stream available");
        }

        const decoder = new TextDecoder();

        if (!reader) {
            loading.value = false;
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

                    newMessage.text += line;
                    // Auto-scroll pendant le streaming
                    scrollToBottom();

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


const Open = async (): Promise<void> => {

    await nextTick();

    isPhone.value = props.fullscreen || document.body.classList.contains('phone');

    if (route.query.chatbot) {
        open.value = true;
    }

    const int = setInterval(async () => {

            // créer la session
            const res = await fetch(`${api_url}/api/ai/create`, {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    user: user.value
                })
            }).then(res => res.json())

            if (res.error) {
                silverIA_active.value = false;
                add_error(res.message);
                first_loaded.value = true;
                return clearInterval(int)
            }

            if (res.success) {
                session_id.value = res.session.uuid;
                user_id.value = user.value?.id;
                first_loaded.value = true;
                return clearInterval(int)
            }

    }, 1000)

}



window.addEventListener("resize", updateSize);

onUnmounted(() => {
  window.removeEventListener("resize", updateSize);
});


onUnmounted(() => close());
onMounted(() => {
    if (user.value?.id) return Open();
    const interval = setInterval(() => {
        if (user.value?.id)
        {
            Open();
            clearInterval(interval);
            return;
        }
    }, 1000)
});



watch(() => route.query.aiquery, () => {
    if (route.query.aiquery && route.query.aiquery !== '') {
        add_message(String(route.query.aiquery));
    }
});

watch(() => route.query.chatbot, () => {
    if (
        route.query.chatbot 
        && route.query.chatbot == 'fixed' 
        || route.query.chatbot == 'relative'
    )
    {
        pos.value = route.query.chatbot;
        open.value = true;
    }
})

watch(() => open.value, async () => {
    await nextTick(() => {
        console.log('Initializing resize...');
        initResize();
        // Scroll initial quand on ouvre
        if (open.value) {
            setTimeout(() => scrollToBottom(true), 100);
        }
    });
})

watch(() => route.name, () => {
    if (![ 'Edit', 'Share' ].includes(route.name as string))
    {
        pos.value = 'fixed';
    }
})

watch(screen_w, () => {
    isPhone.value = props.fullscreen || document.body.classList.contains('phone');
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

.open-anyware {
    background-image: url('../../assets/svgs/open-in-new.svg');
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
    border-top: 2px solid var(--btn);
}

.hover {
    transition: all 0.3s;
}

.hover:hover {
    transform: scale(1.1);
} 


.resize-handle-bar {
  position: absolute;
  top: 0;
  left: -6px;
  width: 12px;
  height: 100%;
  cursor: ew-resize;
  background: transparent;
  transition: background-color 0.2s;
  z-index: 50;
}

.resize-handle-bar:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.scroll-to-bottom-btn {
    position: sticky;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #ff5e62 0%, var(--btn) 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    font-size: 0.9em;
    transition: all 0.3s ease;
    z-index: 10;
    white-space: nowrap;
}

.scroll-to-bottom-btn:hover {
    transform: translateX(-50%) scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.scroll-to-bottom-btn:active {
    transform: translateX(-50%) scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
}

</style>