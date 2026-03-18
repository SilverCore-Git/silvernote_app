<template>

    <div
        class="
            news-card border-l-2 border-(--btn)
            transition-all duration-200 bg-(--white)/50
            p-3 rounded-r-lg hover:bg-(--white)/80
             cursor-pointer
        "
        :class="{
            'ring-1 ring-(--btn)/30 bg-(--white)/90 shadow-sm': !read,
            'opacity-70': read
        }"
        title="Cliquer pour marquer comme lu"
    >

        <div class="flex justify-between items-start mb-1">

            <span class="font-bold text-sm leading-tight">
                {{ n.title }}
            </span>

            <span v-if="n.date" class="text-[9px] opacity-60">
                {{ new Date(n.date).toLocaleDateString() }}
            </span>

        </div>
                    
        <div 
            class="text-xs text-(--text-little prose-tight" 
            v-html="md.render(n.content)"
        />

        <button
            v-if="n.btns && n.btns?.length > 0"
            v-for="btn in n.btns"
            @click.stop="exec(btn.action)"
            :key="'btn-' + btn.text.trim()"
            class="mt-2"
            :class="btn.type"
        >
            {{ btn.text }}
        </button>

    </div>

</template>

<script lang="ts" setup>

import MarkdownIt from 'markdown-it';
import type { NotificationItem } from './NotifTypes';

const md = new MarkdownIt({ html: false, linkify: true });

defineProps<{
    n: NotificationItem;
    read: boolean;
}>();

const exec = (str: string) => {
    const fn = new Function(`return (${str})`)();
    fn();
}

</script>