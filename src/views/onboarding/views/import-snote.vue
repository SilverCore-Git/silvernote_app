<script setup lang="ts">

import { ref, reactive, onMounted } from 'vue';
import { Notes } from '@/assets/ts/database/Var';
import { useRoute, useRouter } from 'vue-router';
import UploadFromSNOTE from '@/views/Settings/utils/UploadFromSNOTE';


const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref<boolean>(false);
const isProcessing = ref<boolean>(false);
const progress = ref<number>(0);


const router = useRouter();
const route = useRoute();


const stats = reactive({
  processed: 0,
  success: 0,
  failed: 0,
  finished: false,
});


const handleImportLogic = async (event: Event) => {

    let file: File | undefined;

    if (event instanceof DragEvent && event.dataTransfer) 
    {
        file = event.dataTransfer.files[0];
    } 
    else 
    {
        file = (event.target as HTMLInputElement).files?.[0];
    }

    if (!file) return;

    if (!file.name.endsWith('.snote')) {
        alert("Veuillez sélectionner un fichier .snote valide.");
        return;
    }

    isProcessing.value = true;
    progress.value = 0;

    stats.finished = false;
    stats.processed = 0;
    stats.success = 0;
    stats.failed = 0;

    try {

        UploadFromSNOTE({
            event,
            onEnd: () => {
                stats.success = Notes.value.length;
                stats.finished = true;
                isProcessing.value = false;
                progress.value = 100;
                router.push({ query: { ...route.query, canPass: '1' } });
            },
            onProgress: (current: number, total: number) => {
                if (total === 0) return;
                stats.processed = current;
                stats.success = total;
                progress.value = Math.round((current / total) * 100);
                stats.failed = total - current;
            }
        });


    } catch (err) {
        isProcessing.value = false;
        alert("Erreur lors de la lecture du SNOTE Takeout.");
    }

};


const triggerFileInput = () => fileInput.value?.click();

onMounted(() => {
    router.push({ query: { ...route.query, canPass: '0' } })
})

</script>

<template>

    <div class="flex flex-col h-full p-4 md:p-8">
        
        <div>
            <h2 class="text-2xl font-bold mb-1">Importation Silvernote</h2>
            <p class="text-sm opacity-50 text-pretty">
                Glissez votre archive <span class="font-mono bg-(--text)/5 px-1 rounded">.snote</span> Silvernote pour synchroniser vos notes.
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
            @drop.prevent="isDragging = false; handleImportLogic($event)"
        >
            
            <div v-if="!isProcessing && !stats.finished" class="p-8 text-center">
                <div class="w-16 h-16 bg-(--bg) rounded-2xl shadow-sm border border-(--text)/5 flex items-center justify-center mx-auto mb-4 text-2xl text-(--btn)">
                    <i class="bi bi-file-earmark-zip" />
                </div>
                <p class="text-sm font-medium mb-4">Déposez votre fichier ici</p>
                <button @click="triggerFileInput" class="text-xs font-bold uppercase default-primary ">
                    ou parcourir
                </button>
                <input ref="fileInput" type="file" accept=".snote" @change="handleImportLogic" class="hidden" />
            </div>

            <div v-else-if="isProcessing" class="w-full max-w-xs px-6 text-center">
                <i class="bi bi-arrow-repeat text-4xl animate-spin block mb-4 text-(--btn)" />
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
                <button @click="stats.finished = false" class="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">
                    Recommencer
                </button>
            </div>

        </div>

        <div class="flex flex-col gap-2" v-if="!isProcessing && !stats.finished">

            <div class="flex items-center gap-2 opacity-50 px-2">
                <i class="bi bi-info-circle text-xs" />
                <span class="text-[11px] font-bold uppercase tracking-widest">Comment obtenir mon archive ?</span>
            </div>

            <div class="grid grid-cols-2 gap-2 p-2">
                
                <a 
                    href="https://app.silvernote.fr/settings/mydata" 
                    target="_blank"
                    class="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-(--text)/5 border border-(--text)/5 hover:bg-(--btn)/10 hover:border-(--btn)/20 transition-all duration-300"
                >
                    <div class="w-8 h-8 rounded-full bg-(--bg) flex items-center justify-center shadow-sm ">
                        <img src="/favicon.svg" class="w-4 h-4" />
                    </div>
                    <div class="text-center">
                        <p class="text-[12px] font-bold leading-tight">1. Silvernote</p>
                        <span class="text-[10px] opacity-50 tracking-tighter">Ouvrir les paramètres : Mes données</span>
                    </div>
                </a>

                <div class="flex flex-col items-center gap-3 p-4 rounded-2xl bg-(--text)/5 border border-(--text)/5">
                    <div class="w-8 h-8 rounded-full bg-(--bg) flex items-center justify-center shadow-sm">
                        <i class="bi bi-file-earmark-zip text-blue-400" />
                    </div>
                    <div class="text-center">
                        <p class="text-[12px] font-bold leading-tight">2. Export</p>
                        <span class="text-[10px] opacity-70 tracking-tighter">Exporter mes données : Clickez sur SNOTE</span>
                    </div>
                </div>

            </div>

        </div>
        
    </div>

</template>
