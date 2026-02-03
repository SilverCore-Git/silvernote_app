<script setup lang="ts">

import { setThemePreference } from '@/assets/ts/theme';
import DefaultNoteCard from '@/views/Home/components/common/DefaultNoteCard.vue';
import { IsPrivate, setPrivate } from '@/assets/ts/settings/privatMode';
import { ref, watch } from 'vue';
import Switch from '@/components/inputs/Switch.vue';
import Popup from '@/components/popup/Popup.vue';
import darkenHex from '@/assets/ts/utils/darkenHex';

type Theme = 'light' | 'dark' | 'default';

const savedTheme = window.localStorage.getItem('theme') as Theme | null;
const currentTheme = ref<Theme>(savedTheme || 'default');
const eggMenu = ref<boolean>(false);

const themes = [
  { id: 'light', label: 'Clair', icon: 'bi-sun' },
  { id: 'dark', label: 'Sombre', icon: 'bi-moon' },
  { id: 'default', label: 'Système', icon: 'bi-display' },
];

let pressCount: number = 0
const handleEgg = (e?: Event) => {

    pressCount++

    if (pressCount > 5)
    {
        if (e)
        {
            const target = e.target as HTMLSelectElement;
            document.documentElement.style.setProperty('--btn', target.value);
            document.documentElement.style.setProperty('--btn-hover', darkenHex(target.value));
        }
        else eggMenu.value = true;
    }

}

watch(currentTheme, (newTheme) => {
    setThemePreference(newTheme);
});


</script>

<template>
        
    <div class="min-h-full w-full p-8 transition-colors duration-300">
        
        <header class="mb-8">

            <h1 class="font-bold text-3xl mb-2 tracking-tight">
                Apparence
            </h1>

            <p class="opacity-60 text-sm">
                Personnalisez l'apparence de l'application selon vos préférences.
            </p>

        </header>

        <section class="mb-8">

            <h2 class="font-semibold text-lg mb-4">Thème</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-1 bg-(--bg2) rounded-xl border border-(--white)/10">
                
                <button
                    v-for="theme in themes"
                    :key="theme.id"
                    @click="currentTheme = theme.id as Theme"
                    :class="[
                        'flex flex-col items-center justify-center py-4 px-6 rounded-lg transition-all duration-200 gap-2 border-2 cursor-pointer',
                        currentTheme === theme.id 
                            ? 'bg-(--bg) border-(--btn) shadow-lg' 
                            : 'border-transparent hover:bg-(--bg)/50 opacity-70 hover:opacity-100'
                    ]"
                >
                    <i class="bi text-2xl" :class="theme.icon" />
                    <span class="font-medium text-sm">{{ theme.label }}</span>
                </button>

            </div>

        </section>

        <section class="mb-8">

            <h2 class="font-semibold text-lg mb-4">Mode privée</h2>

            <div class="flex items-center justify-between">
                <div>
                    <div class="font-medium">Activer le mode privée</div>
                    <div class="text-xs opacity-60">Ne pas afficher le contenu des notes.</div>
                </div>
                <Switch
                    :model-value="IsPrivate!"
                    @update:model-value="setPrivate(!IsPrivate)"
                />
            </div>

        </section>

        <section>

            <h2 class="font-semibold text-lg mb-4">Aperçu des couleurs</h2>
            
            <div class="p-6 rounded-xl bg-[var(--bg2)] border border-[var(--white)]/10 space-y-4">

                <div class="flex items-center justify-between">

                    <span class="font-medium">Bouton Principal</span>

                    <button @click="handleEgg()" class="primary">
                        Action
                    </button>

                </div>
                
                <div class=" pointer-events-none">
                    <DefaultNoteCard
                        title="Ma super note"
                        content="Lorem ipsum dolor sit amet. Ut reiciendis voluptatem hic quibusdam alias qui galisum exercitationem in voluptas ullam cum ipsa fugit quo fuga omnis qui itaque sunt. Aut sunt dicta aut iure libero vel quia veritatis! Est corporis nobis sit optio omnis ab repudiandae fugiat qui voluptatem incidunt aut quas distinctio."
                        :tags="[]"
                        uuid="0"
                        icon="/favicon.ico"
                    />
                </div>

            </div>

        </section>

    </div>

    <Popup v-model:visible="eggMenu">
        <input type="color" @change="handleEgg($event)">
    </Popup>

</template>