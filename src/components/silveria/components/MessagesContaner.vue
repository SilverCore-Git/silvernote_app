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
        class="flex w-full mb-4"
        :class="
            msg.role === 'user' 
                ? 'justify-end' 
                : 'justify-start'"
    >
        <div 
            class="
                max-w-[90%] rounded-2xl
                px-4 py-3 text-sm 
                leading-relaxed shadow-sm
            "
            :class="[
                msg.role === 'user' 
                ? 'bg-(--btn) text-white rounded-br-none' 
                : 'bg-(--bg2) border border-(--text)/10 rounded-bl-none prose-custom'
            ]"
            style="overflow-wrap: break-word; word-break: break-word;"
        >
        
            <div 
                v-if="msg.role === 'assistant'"
                v-html="md.render(msg.content)"
                class="markdown-content"
            ></div>

            <div v-else style="white-space: pre-wrap;">
                {{ msg.content }}
            </div>

        </div>

    </div>

</template>