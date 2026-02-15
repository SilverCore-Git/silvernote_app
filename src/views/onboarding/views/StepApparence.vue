<template>

  <div class="flex flex-col h-full">

    <h2 class="text-2xl font-bold">
      Définissez votre thème :
    </h2>

    <div class="my-auto" >
            
      <div class="grid grid-cols-1 gap-2 p-1 bg-(--bg2) rounded-xl border border-(--text)/5">
                
        <button
            v-for="theme in themes"
            :key="theme.id"
            @click="currentTheme = theme.id as Theme"
            :class="[
                'flex flex-col items-center justify-center py-4 px-6 rounded-lg transition-all duration-200 gap-2 border-2 cursor-pointer h-full',
                currentTheme === theme.id 
                    ? 'bg-(--bg) border-(--btn) shadow-lg text-(--btn)' 
                    : 'border-transparent hover:bg-(--bg)/50 opacity-70 hover:opacity-100'
            ]"
        >
            <i class="bi text-2xl" :class="currentTheme === theme.id ? theme.icon + '-fill' : theme.icon" />
            <span class="font-medium text-sm">{{ theme.label }}</span>
        </button>

      </div>
        
    </div>

  </div>

</template>

<script setup lang="ts">

import { setThemePreference } from '@/assets/ts/theme';
import { ref, watch } from 'vue';

defineProps<{ 
  modelValue: string 
}>();

const themes = [
  { id: 'light', label: 'Clair', icon: 'bi-sun' },
  { id: 'dark', label: 'Sombre', icon: 'bi-moon' },
  { id: 'default', label: 'Système', icon: 'bi-display' },
];

type Theme = 'light' | 'dark' | 'default';

const savedTheme = window.localStorage.getItem('theme') as Theme | null;
const currentTheme = ref<Theme>(savedTheme || 'default');

watch(currentTheme, (newTheme) => {
    setThemePreference(newTheme);
});

</script>