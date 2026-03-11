<template>

    <Popup v-model:visible="stats_menu">

        <div class="flex flex-col gap-6">

            <div class="flex items-center gap-3">
                <i class="bi bi-bar-chart-line text-2xl" />
                <h2 class="text-2xl font-bold">Informations de la note</h2>
            </div>

            <div class="grid grid-cols-2 gap-4">

                <div class="border border-(--text)/10 bg-(--bg2) rounded-lg p-4">
                    <div class="text-xs flex items-center gap-1.5 mb-1">
                        <i class="bi bi-calendar-plus" /> Créée le
                    </div>
                    <div class="font-semibold text-sm text-(--text)/70">
                        {{ formatDate(note.date) }}
                    </div>
                </div>

                <div class="border border-(--text)/10 bg-(--bg2) rounded-lg p-4">
                    <div class="text-xs flex items-center gap-1.5 mb-1">
                        <i class="bi bi-pencil-square" /> Mise à jour
                    </div>
                    <div class="font-semibold text-sm text-(--text)/70">
                        {{ formatDate(note.lastSaveAt) }}
                    </div>
                </div>

                <div class="border border-(--text)/10 bg-(--bg2) rounded-lg p-4">
                    <div class="text-xs flex items-center gap-1.5 mb-1">
                        <i class="bi bi-fonts" /> Mots
                    </div>
                    <div class="font-semibold text-xl text-(--text)/70">
                        {{ wordCount }}
                    </div>
                </div>

                <div class="border border-(--text)/10 bg-(--bg2) rounded-lg p-4">
                    <div class="text-xs flex items-center gap-1.5 mb-1">
                        <i class="bi bi-text-center" /> Caractères
                    </div>
                    <div class="font-semibold text-xl text-(--text)/70">
                        {{ characterCount }}
                    </div>
                </div>

                <div class="border border-(--text)/10 bg-(--bg2) rounded-lg p-4">
                    <div class="text-xs flex items-center gap-1.5 mb-1">
                        <i class="bi bi-sticky" /> Type de note
                    </div>
                    <div class="font-semibold text-lg text-(--text)/70">
                        {{ note.content_type }}
                    </div>
                </div>

                <div class="border border-(--text)/10 bg-(--bg2) rounded-lg p-4">
                    <div class="text-xs flex items-center gap-1.5 mb-1">
                        <i class="bi bi-lock" /> Chiffrement
                    </div>
                    <div class="font-semibold text-lg text-(--text)/70">
                        AES-256-GCM
                    </div>
                </div>

            </div>

        </div>

    </Popup>

</template>

<script setup lang="ts">

import Popup from '@/components/popup/Popup.vue'
import type { Note } from '@/assets/ts/type';
import { computed } from 'vue';

const props = defineProps<{
  note: Note;
}>();

const stats_menu = defineModel<boolean>('visible')

const formatDate = (date: number | string | undefined) => {
    if (!date) return '...';
    return new Date(date).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const wordCount = computed(() => {
    return props.note.content?.trim().split(/\s+/).filter(Boolean).length || 0;
});

const characterCount = computed(() => {
    return props.note.content?.length || 0;
});

</script>