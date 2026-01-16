<script setup lang="ts">
    
import { messages } from '../composables/useMessage';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

</script>

<template>

    <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="flex w-full mb-4 animate-fade-in"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
    >

        <div 
            class="
                max-w-[90%] rounded-2xl
                px-4 py-3 text-sm 
                leading-relaxed shadow-sm
                transition-all duration-200
            "
            :class="[
                msg.role === 'user' 
                ? 'bg-(--btn) text-white rounded-br-none' 
                : 'bg-(--bg2) border border-(--text)/10 rounded-bl-none prose-custom text-(--text)'
            ]"
            style="overflow-wrap: break-word; word-break: break-word;"
        >
        
            <div 
                v-if="msg.role === 'assistant'"
                class="markdown-content"
            >
                <div v-if="msg.content === '' || msg.isThinking" class="flex space-x-1 h-6 items-center">
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
                
                <div v-else v-html="md.render(msg.content)"></div>
            </div>

            <div v-else style="white-space: pre-wrap;">
                {{ msg.content }}
            </div>

        </div>

    </div>

</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>