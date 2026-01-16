<script setup lang="ts">

import { messages } from '../composables/useMessage';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true, linkify: true });

const parseContent = (content: string) => {

    if (!content) return [];
    
    const parts = content.split(/(\[TOOL:.*?\])/g);
    
    return parts.map(part => {
        if (part.startsWith('[TOOL:') && part.endsWith(']')) {
        return {
            type: 'tool',
            value: part.replace('[TOOL:', '').replace(']', '').trim()
        };
        }
        return { type: 'text', value: part };
    });

};

const getToolIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('search')) return 'bi-search';
    if (n.includes('note')) return 'bi-journal-text';
    if (n.includes('web')) return 'bi-globe';
    return 'bi-cpu';
};

</script>

<template>

    <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="flex w-full mb-6 animate-fade-in"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
    >
        
        <div
            class="max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm"
            :class="
                msg.role === 'user' 
                    ? 'bg-(--btn) text-white rounded-br-none' 
                    : 'bg-(--bg2) border border-(--text)/10 rounded-bl-none text-(--text)'
            "
        >
        
            <div v-if="msg.role === 'assistant'">
                
                <template 
                    v-for="(part, index) in parseContent(msg.content)" 
                    :key="index"
                >
                    
                    <div v-if="part.type === 'text' && part.value.trim()" 
                        v-html="md.render(part.value)" 
                        class="markdown-content prose-custom">
                    </div>

                    <div
                        v-else-if="part.type === 'tool'" 
                        class="
                            my-3 flex items-center gap-3 p-3
                            rounded-xl bg-(--bg) border border-(--btn)/20
                            text-(--btn) shadow-inner border-dashed
                        "
                    >

                        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-(--btn)/10">
                            <i :class="['bi', getToolIcon(part.value), 'animate-pulse']"></i>
                        </div>

                        <div class="flex flex-col">
                            <span class="text-[10px] uppercase tracking-wider opacity-60 font-bold">Action SilverIA</span>
                            <span class="text-xs font-semibold">{{ part.value }}...</span>
                        </div>

                    </div>

                </template>

                <div v-if="msg.content === '' || msg.isThinking" class="flex space-x-1 h-6 items-center py-2">
                    <span class="w-1.5 h-1.5 bg-(--btn) rounded-full animate-bounce" />
                    <span class="w-1.5 h-1.5 bg-(--btn) rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span class="w-1.5 h-1.5 bg-(--btn) rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>

            </div>

            <div v-else style="white-space: pre-wrap;">{{ msg.content }}</div>

        </div>

    </div>

</template>

<style scoped>
:deep(.markdown-content p) {
  margin-bottom: 0.5rem;
}
:deep(.markdown-content p:last-child) {
  margin-bottom: 0;
}
</style>