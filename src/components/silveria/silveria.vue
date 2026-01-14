<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';
import MarkdownIt from 'markdown-it';

// Initialisation du parseur Markdown
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

const isOpen = ref(false);
const isMaximised = ref(false); // État pour la taille
const messages = ref<Message[]>([]);
const userInput = ref('');
const isLoading = ref(false);
const chatBody = ref<HTMLElement | null>(null);

const suggestions = ["Résumé cette note", "Idée de plan", "Corrige l'orthographe"];

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) setTimeout(scrollToBottom, 100);
};

const toggleMaximise = () => {
  isMaximised.value = !isMaximised.value;
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight;
  }
};

const sendMessage = async (text: string = userInput.value) => {
  const content = text.trim();
  if (!content || isLoading.value) return;

  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: content,
    timestamp: Date.now()
  });

  userInput.value = '';
  isLoading.value = true;
  await scrollToBottom();

  try {
    // Simulation API
    await new Promise(r => setTimeout(r, 1500));
    
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: "Voici un exemple de **Markdown** :\n\n- Point 1\n- Point 2\n\n```js\nconsole.log('Ceci est bien formaté');\n```",
      timestamp: Date.now()
    });
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};
</script>

<template>

    <div
        class="
            fixed bottom-30 right-7
            flex flex-col items-end
            gap-4 pointer-events-none
            z-50
        "
    >
        
        <Transition name="slide-fade">

            <div 
                v-if="isOpen"
                class="
                    pointer-events-auto
                    bg-(--bg) border border-(--text)/10
                    rounded-2xl shadow-2xl overflow-hidden
                    flex flex-col transition-all duration-500
                    ease-in-out origin-bottom-right
                    absolute bottom-20 right-0
                "
                :class="[
                    isMaximised 
                        ? 'w-[95vw] h-[85vh] sm:w-[800px] sm:h-[700px]' 
                        : 'w-[90vw] h-[500px] sm:w-[400px]'
                ]"
            >

                <div
                    class="
                        flex items-center justify-between
                        p-4 border-b border-(--text)/5
                        bg-(--bg2)
                    "
                >

                    <div
                        class="flex items-center gap-3"
                    >

                        <div
                            class="
                                w-8 h-8 rounded-full
                                bg-linear-to-tr from-(--btn)
                                to-(--btn-hover) flex items-center
                                justify-center shadow-lg
                            "
                        >    
                            <i class="bi bi-stars text-white text-sm" />
                        </div>

                        <div>

                            <h3 class="font-bold text-sm">SilverIA</h3>
                            <div class="text-[10px] opacity-50 flex items-center gap-1">
                                <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                Agent
                            </div>

                        </div>

                    </div>

                    <div class="flex gap-1">

                        <button 
                            @click="toggleMaximise" 
                            class="header-btn" 
                            :title="isMaximised ? 'Réduire' : 'Agrandir'"
                        >
                            <i :class="isMaximised ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen'" />
                        </button>

                        <button 
                            @click="messages = []" 
                            class="header-btn"
                            title="Effacer"
                        >
                            <i class="bi bi-eraser" />
                        </button>

                        <button 
                            @click="toggleChat" 
                            class="header-btn"
                        >
                            <i class="bi bi-x-lg" />
                        </button>

                    </div>

                </div>

                <div 
                    ref="chatBody"
                    class="
                        flex-1 overflow-y-auto p-4
                        space-y-6 bg-(--bg) scroll-smooth
                    "
                >

                    <div
                        v-if="messages.length === 0"
                        class="
                            h-full flex flex-col 
                            items-center justify-center
                            text-center opacity-60
                        "
                    >

                        <i class="bi bi-chat-dots text-4xl mb-4" />

                        <p class="text-sm mb-6">
                            Comment puis-je t'aider aujourd'hui ?
                        </p>

                        <div class="flex flex-wrap justify-center gap-2 max-w-[80%]">
                            <button 
                                v-for="sugg in suggestions"
                                :key="sugg"
                                @click="sendMessage(sugg)"
                                class="suggestion-tag"
                            >
                                {{ sugg }}
                            </button>
                        </div>

                    </div>

                    <div 
                        v-for="msg in messages" 
                        :key="msg.id" 
                        class="flex w-full"
                        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
                    >

                        <div 
                            class="max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm"
                            :class="[
                                msg.role === 'user' 
                                ? 'bg-(--btn) text-white rounded-br-none' 
                                : 'bg-(--bg2) border border-(--text)/10 rounded-bl-none prose-custom'
                            ]"
                        >

                            <div 
                                v-if="msg.role === 'assistant'"
                                v-html="md.render(msg.content)"
                                class="markdown-content"
                            ></div>

                            <div v-else>
                                {{ msg.content }}
                            </div>

                        </div>

                    </div>

                    <div 
                        v-if="isLoading"
                        class="flex justify-start"
                    >
                        <div
                            class="
                                bg-(--bg2) border border-(--text)/10
                                px-4 py-3 rounded-2xl rounded-bl-none
                                flex gap-1 items-center
                            "
                        >
                            <span class="dot-bounce" />
                            <span class="dot-bounce delay-100" />
                            <span class="dot-bounce delay-200" />
                        </div>
                    </div>

                </div>

                    
                <div 
                    class="p-4 bg-(--bg2) border-t border-(--text)/5"
                >

                    <div
                        class="
                            relative flex items-end
                            gap-2 bg-(--bg) p-2
                            rounded-xl border border-(--text)/10
                            focus-within:border-(--btn) transition-all
                        "
                    >

                        <textarea
                            v-model="userInput"
                            @keydown.enter.exact.prevent="sendMessage()"
                            placeholder="Posez votre question..."
                            rows="1"
                            v-autosize
                            class="
                                w-full bg-transparent border-none
                                focus:ring-0 text-sm resize-none
                                max-h-40 py-2 px-2 outline-none
                            "
                        />

                        <button 
                            @click="sendMessage()"
                            :disabled="!userInput.trim() || isLoading"
                            class="
                                h-9 w-9 rounded-lg
                                flex items-center justify-center
                                shrink-0 transition-all mb-0.5
                            "
                            :class="
                                userInput.trim() 
                                    ? 'bg-(--btn) text-white shadow-lg scale-105' 
                                    : 'bg-(--text)/10 text-(--text)/20'
                            "
                        >
                            <i class="bi bi-send-fill text-sm" />
                        </button>

                    </div>

                </div>

            </div>
            
        </Transition>

        <button 
            @click="toggleChat"
            class="
                pointer-events-auto
                bg-(--white) hover:bg-(--bg2) border-gray-200
                hover:text-(--btn) hover:border
                transition-all duration-300 ease-in-out
                w-14 h-14 rounded-full
                flex justify-center items-center
                text-2xl shadow-lg bounce-hover
                cursor-pointer
            "
        >

            <i 
                class="bi bi-stars text-(--btn) absolute transition-all" 
                :class="
                    isOpen 
                        ? 'opacity-0 rotate-90' 
                        : 'opacity-100'
                "
            />
            <i 
                class="bi bi-chevron-down text-gray-500 absolute transition-all" 
                :class="
                    isOpen 
                        ? 'opacity-100' 
                        : 'opacity-0 -rotate-90'
                "
            />

        </button>

    </div>

</template>

<style scoped>

.header-btn {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    transition: all 0.2s;
    cursor: pointer;
    background: transparent;
    border: none;
    color: inherit;
}

.header-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--btn);
}

.suggestion-tag {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    background-color: var(--bg2);
    border: 1px solid rgba(var(--text-rgb), 0.1);
    transition: all 0.2s;
    cursor: pointer;
    color: inherit;
}

.suggestion-tag:hover {
    border-color: var(--btn);
    color: var(--btn);
}

.dot-bounce {
    width: 0.375rem;
    height: 0.375rem;
    background-color: var(--btn);
    border-radius: 50%;
    animation: bounce 1s infinite;
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
}

.markdown-content :deep(p) { 
    margin-bottom: 0.75rem; 
}

.markdown-content :deep(p:last-child) { 
    margin-bottom: 0; 
}

.markdown-content :deep(code) { 
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-family: ui-monospace, monospace;
}

.markdown-content :deep(pre) {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
    overflow-x: auto;
    font-size: 0.75rem;
}

.markdown-content :deep(ul), 
.markdown-content :deep(ol) {
    margin-left: 1rem;
    margin-bottom: 0.5rem;
    list-style: initial;
}

.slide-fade-enter-active, 
.slide-fade-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from, 
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
}

</style>