<script setup lang="ts">

import { messages } from '../composables/useMessage';
import { tools } from '../composables/useSilveriaAPI/useTools';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true, linkify: true });

const getToolIcon = (toolName: string) => {
    const icons: Record<string, string> = {
        'web_search': '🔍',
        'calculator': '🧮',
        'database': '💾',
        'api_call': '🔌',
        'image_generation': '🎨',
        'code_execution': '💻',
        'file_read': '📄',
        'default': '🔧'
    };
    return icons[toolName.toLowerCase()] || icons.default;
};

const getToolsForMessage = (messageId: number) => {
  return tools.value.filter(tool => tool.id.startsWith(String(messageId)));
};

</script>

<template>
        
    <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex w-full mb-6 animate-fade-in"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
    >

        <div class="max-w-[90%] flex flex-col gap-3">
            
            <div 
                v-if="msg.role === 'assistant' && getToolsForMessage(msg.id).length > 0"
                class="flex flex-col gap-2"
            >

                <div
                    v-for="tool in getToolsForMessage(msg.id)"
                    :key="tool.id"
                    class="bg-(--bg2) border border-(--text)/10 rounded-xl px-4 py-3 text-sm"
                >
                    
                
                    <div class="flex items-center gap-2 mb-2">

                        <span class="text-lg">{{ getToolIcon(tool.name) }}</span>
                        <span class="font-medium text-(--text)">{{ tool.name }}</span>
                        

                        <div class="ml-auto flex items-center gap-2">

                            <div v-if="tool.loading" class="flex items-center gap-1.5">
                                <div class="w-1 h-1 bg-(--btn) rounded-full animate-pulse"></div>
                                <div class="w-1 h-1 bg-(--btn) rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div class="w-1 h-1 bg-(--btn) rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            </div>

                            <div v-else-if="tool.error" class="flex items-center gap-1.5 text-red-500">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span class="text-xs">Erreur</span>
                            </div>

                            <div v-else-if="tool.result" class="flex items-center gap-1.5 text-green-500">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span class="text-xs">Terminé</span>
                            </div>

                        </div>
                        
                    </div>
                    
                    <div v-if="tool.error" class="mt-2 pt-2 border-t border-red-500/20">
                        <div class="text-xs text-red-500 bg-red-500/10 rounded-lg p-2">
                            {{ tool.error }}
                        </div>
                    </div>

                </div>

            </div>

            <div
                class="rounded-2xl px-4 py-3 text-sm shadow-sm transition-all"
                :class="
                msg.role === 'user'
                    ? 'bg-(--btn) text-white rounded-br-none'
                    : 'bg-(--bg2) border border-(--text)/10 rounded-bl-none text-(--text)'
                "
            >
            
                <div v-if="msg.role === 'assistant'">

                    <div
                        v-if="msg.content && !msg.isThinking"
                        v-html="md.render(msg.content)"
                        class="markdown-content prose-custom"
                    ></div>

                    <div v-if="msg.content === '' || msg.isThinking" class="flex items-center gap-2 py-2">
                        <span class="w-1.5 h-1.5 bg-(--btn) rounded-full animate-bounce" />
                        <span class="w-1.5 h-1.5 bg-(--btn) rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span class="w-1.5 h-1.5 bg-(--btn) rounded-full animate-bounce [animation-delay:-0.3s]" />
                    </div>

                </div>

                <div v-else style="white-space: pre-wrap;">{{ msg.content }}</div>

            </div>

        </div>

    </div>

</template>

<style scoped>

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

:deep(.markdown-content p) {
  margin-bottom: 0.5rem;
}

:deep(.markdown-content p:last-child) {
  margin-bottom: 0;
}

:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
}

:deep(.markdown-content li) {
  margin-bottom: 0.25rem;
}

:deep(.markdown-content code) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

:deep(.markdown-content pre) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 0.5rem;
}

:deep(.markdown-content pre code) {
  background-color: transparent;
  padding: 0;
}

</style>