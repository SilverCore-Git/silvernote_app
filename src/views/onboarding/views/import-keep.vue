<script setup lang="ts">

import { ref, reactive, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useKeepImporter, type KeepNoteParsed } from '@/composables/useKeepImporter';
import type { Note } from '@/assets/ts/type';
import database from '@/assets/ts/database/database';
import { Notes } from '@/assets/ts/database/Var';
import { useRoute, useRouter } from 'vue-router';
import BackBtn from '@/components/backBtn.vue';


const { processZip, isProcessing, progress, currentFileName } = useKeepImporter();
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref<boolean>(false);
const router = useRouter();
const route = useRoute();


const stats = reactive({
  processed: 0,
  success: 0,
  failed: 0,
  finished: false,
});


const handleImportLogic = async (file: File) => {

    if (!file.name.endsWith('.zip')) {
        alert("Veuillez sélectionner un fichier .zip valide.");
        return;
    }

    stats.finished = false;
    stats.processed = 0;
    stats.success = 0;
    stats.failed = 0;

    try {

        await processZip(file, async (note: KeepNoteParsed) => {
            stats.processed++;
            try {
                const noteData: Note = {
                    uuid: uuidv4(),
                    title: note.title || 'Note sans titre',
                    user_id: localStorage.getItem('user_id'),
                    content: note.content,
                    date: note.createdAt,
                    tags: [],
                    icon: '',
                    pinned: note.isPinned
                };

                // Ajout local et en DB
                Notes.value.push(noteData);
                await database.create(noteData);

                stats.success++;

            } catch (saveError) {
                stats.failed++;
            }

        });

        stats.finished = true;
        router.push({ query: { ...route.query, canPass: '1' } })

    } catch (err) {
        alert("Erreur lors de la lecture du ZIP Takeout.");
    }

};

const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) handleImportLogic(file);
};

const triggerFileInput = () => fileInput.value?.click();

onMounted(() => {
    router.push({ query: { ...route.query, canPass: '0' } })
})

</script>

<template>

    <BackBtn
        href="/settings/mydata" 
        class="top-4 left-4" 
        v-if="route.name == 'ImportKeep'" 
    />

    <div 
        class="flex flex-col h-full p-4 md:p-8"
        :class="
            route.name == 'ImportKeep'
                ? 'flex justify-center max-w-4xl min-w-xl mx-auto mt-10'
                : ''
        "
    >
        
        <div>
            <h2 class="text-2xl font-bold mb-1">Importation Google Keep</h2>
            <p class="text-sm opacity-50 text-pretty">
                Glissez votre archive <span class="font-mono bg-(--text)/5 px-1 rounded">.zip</span> Google Takeout pour synchroniser vos notes.
            </p>
        </div>

        <div 
            class="h-full min-h-50 my-8 relative flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl transition-all duration-500! overflow-hidden bg-(--text)/5"
            :class="[
                isDragging ? 'border-(--btn) bg-(--btn)/5 scale-[0.98]' : 'border-(--text)/10',
                isProcessing ? 'cursor-wait' : ''
            ]"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="isDragging = false; handleImportLogic($event.dataTransfer?.files[0]!)"
        >
            
            <div v-if="!isProcessing && !stats.finished" class="p-8 text-center">
                <div class="w-16 h-16 bg-(--bg) rounded-2xl shadow-sm border border-(--text)/5 flex items-center justify-center mx-auto mb-4 text-2xl text-(--btn)">
                    <i class="bi bi-file-earmark-zip" />
                </div>
                <p class="text-sm font-medium mb-4">Déposez votre fichier ici</p>
                <button @click="triggerFileInput" class="text-xs font-bold uppercase default-primary ">
                    ou parcourir
                </button>
                <input ref="fileInput" type="file" accept=".zip" @change="onFileChange" class="hidden" />
            </div>

            <div v-else-if="isProcessing" class="w-full max-w-xs px-6 text-center">
                <i class="bi bi-arrow-repeat text-4xl animate-spin block mb-4 text-(--btn)" />
                <p class="text-xs font-mono opacity-50 truncate mb-4">{{ currentFileName }}</p>
                <div class="w-full bg-(--bg) rounded-full h-1.5 overflow-hidden shadow-inner">
                    <div class="h-full bg-(--btn) transition-all duration-300" :style="{ width: `${progress}%` }" />
                </div>
                <div class="mt-2 text-[10px] font-bold opacity-40 uppercase tracking-tighter">{{ progress }}%</div>
            </div>

            <div v-else class="text-center p-8 animate-fade-in">
                <div class="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i class="bi bi-check-all" />
                </div>
                <h3 class="font-bold text-lg mb-1">{{ stats.success }} notes importées</h3>
                <p class="text-xs opacity-50 mb-6">Vos notes sont déjà prêtes dans votre librairie.</p>
                <button @click="stats.finished = false" class="default">
                    Recommencer
                </button>
                <button v-if="route.name == 'ImportKeep'" @click="stats.finished = false; router.push('/')" class="ml-4 primary">
                    Retour à Silvernote
                </button>
            </div>

        </div>

        <div class="flex flex-col gap-2" v-if="!isProcessing && !stats.finished">

            <div class="flex items-center gap-2 opacity-50 px-2">
                <i class="bi bi-info-circle text-xs" />
                <span class="text-[11px] font-bold uppercase tracking-widest">Comment obtenir mon archive ?</span>
            </div>

            <div class="grid grid-cols-3 gap-2 p-2">
                
                <a 
                    href="https://takeout.google.com" 
                    target="_blank"
                    class="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-(--text)/5 border border-(--text)/5 hover:bg-(--btn)/10 hover:border-(--btn)/20 transition-all duration-300"
                >
                    <div class="w-8 h-8 rounded-full bg-(--bg) flex items-center justify-center shadow-sm ">
                        <i class="bi bi-google text-(--btn)" />
                    </div>
                    <div class="text-center">
                        <p class="text-[12px] font-bold leading-tight">1. Google Takeout</p>
                        <span class="text-[10px] opacity-50 tracking-tighter">Ouvrir le site</span>
                    </div>
                </a>

                <div class="flex flex-col items-center gap-3 p-4 rounded-2xl bg-(--text)/5 border border-(--text)/5">
                    <div class="w-8 h-8 rounded-full bg-(--bg) flex items-center justify-center shadow-sm">
                        <i class="bi bi-check2-circle text-(--btn)" />
                    </div>
                    <div class="text-center">
                        <p class="text-[12px] font-bold leading-tight">2. Sélection</p>
                        <span class="text-[10px] opacity-50 tracking-tighter">Cochez "Keep"</span>
                    </div>
                </div>

                <div class="flex flex-col items-center gap-3 p-4 rounded-2xl bg-(--text)/5 border border-(--text)/5">
                    <div class="w-8 h-8 rounded-full bg-(--bg) flex items-center justify-center shadow-sm">
                        <i class="bi bi-file-earmark-zip text-blue-400" />
                    </div>
                    <div class="text-center">
                        <p class="text-[12px] font-bold leading-tight">3. Export</p>
                        <span class="text-[10px] opacity-50 tracking-tighter">Fichier .zip</span>
                    </div>
                </div>

            </div>

        </div>
        
    </div>

</template>
