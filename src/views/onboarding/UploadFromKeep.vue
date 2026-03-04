<script setup lang="ts">

import { ref, reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useKeepImporter, type KeepNoteParsed } from '@/composables/useKeepImporter';
import type { Note } from '@/assets/ts/type';
import database from '@/assets/ts/database/database';
import { Notes } from '@/assets/ts/database/Var';


const { processZip, isProcessing, progress, currentFileName } = useKeepImporter();
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref<boolean>(false);

const stats = reactive({
  processed: 0,
  success: 0,
  failed: 0,
  finished: false,
});


const resetStats = () => {
  stats.processed = 0;
  stats.success = 0;
  stats.failed = 0;
  stats.finished = false;
};


const handleImportLogic = async (file: File) => {
    
    if (!file.name.endsWith('.zip')) {
        alert("Veuillez sélectionner un fichier .zip valide.");
        return;
    }

    resetStats();

    try {

        // Appel du composable
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

                Notes.value.push(noteData);
                await database.create(noteData);

                stats.success++;

            } catch (saveError) {
                console.error(`Échec import note "${note.title}":`, saveError);
                stats.failed++;
            }

        });

        stats.finished = true;

    } 
    catch (err) 
    {
        console.error("Erreur critique ZIP:", err);
        alert("Impossible de lire le fichier ZIP. Vérifiez qu'il s'agit bien d'un export Google Takeout.");
    }

};


const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) handleImportLogic(file);
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) handleImportLogic(file);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

</script>

<template>
  <div class="w-full max-w-2xl mx-auto p-6 transition-all duration-300">
    
    <header class="mb-8 text-center">
      <h1 class="text-3xl font-bold mb-2 tracking-tight">Importation Google Keep</h1>
      <p class="opacity-60 text-sm">
        Migrez vos notes depuis Google Takeout vers Silvernote en un instant.
      </p>
    </header>

    <div 
      class="relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 bg-[var(--bg2)]"
      :class="[
        isDragging ? 'border-[var(--btn)] bg-[var(--btn)]/5 scale-[1.02] shadow-lg' : 'border-[var(--text-little)]/20',
        isProcessing ? 'cursor-wait' : ''
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      
      <div v-if="!isProcessing && !stats.finished" class="p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
        
        <div class="mb-6 p-4 rounded-full bg-[var(--bg)] shadow-sm border border-[var(--white)]/5">
          <i class="bi bi-file-earmark-zip text-4xl text-[var(--btn)]"></i>
        </div>
        
        <h3 class="font-semibold text-lg mb-2">Glissez votre archive ZIP ici</h3>
        
        <p class="text-sm opacity-60 mb-8 max-w-xs leading-relaxed">
          Le fichier doit contenir les fichiers JSON exportés via Google Takeout.
        </p>

        <button 
          @click="triggerFileInput" 
          class="bg-[var(--btn)] text-white hover:brightness-110 px-6 py-2.5 rounded-lg font-medium transition-transform active:scale-95 shadow-md flex items-center gap-2"
        >
          <i class="bi bi-folder2-open"></i>
          Parcourir les fichiers
        </button>
        
        <input 
          ref="fileInput"
          type="file" 
          accept=".zip" 
          @change="onFileChange" 
          class="hidden" 
        />
      </div>

      <div v-else-if="isProcessing" class="p-12 flex flex-col items-center justify-center min-h-[300px]">
        
        <div class="loader-icon mb-6 text-[var(--btn)]">
          <i class="bi bi-arrow-repeat text-5xl animate-spin block"></i>
        </div>
        
        <h3 class="font-semibold text-lg mb-1">Importation en cours...</h3>
        
        <p class="text-sm opacity-60 mb-6 font-mono text-xs truncate max-w-[250px] bg-[var(--bg)] px-2 py-1 rounded">
          {{ currentFileName }}
        </p>

        <div class="w-full max-w-xs bg-[var(--bg)] rounded-full h-2.5 overflow-hidden relative shadow-inner">
          <div 
            class="h-full bg-[var(--btn)] transition-all duration-300 ease-out relative overflow-hidden"
            :style="{ width: `${progress}%` }"
          >
            <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        
        <div class="mt-2 text-xs font-bold opacity-80">{{ progress }}%</div>
      </div>

      <div v-else class="p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
        
        <div class="mb-6 p-4 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
          <i class="bi bi-check-lg text-4xl"></i>
        </div>
        
        <h3 class="font-bold text-2xl mb-2">Importation terminée !</h3>
        <p class="opacity-60 text-sm mb-8">
          L'analyse du fichier ZIP est complète.
        </p>

        <div class="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
          <div class="bg-[var(--bg)] p-4 rounded-xl border border-[var(--text-little)]/10 flex flex-col items-center">
            <div class="text-3xl font-bold text-green-500 mb-1">{{ stats.success }}</div>
            <div class="text-[10px] uppercase tracking-wider opacity-60 font-bold">Importées</div>
          </div>
          <div class="bg-[var(--bg)] p-4 rounded-xl border border-[var(--text-little)]/10 flex flex-col items-center">
            <div class="text-3xl font-bold" :class="stats.failed > 0 ? 'text-red-500' : 'text-[var(--text-little)]'">
              {{ stats.failed }}
            </div>
            <div class="text-[10px] uppercase tracking-wider opacity-60 font-bold">Échecs</div>
          </div>
        </div>

        <button 
          @click="resetStats" 
          class="text-sm opacity-60 hover:opacity-100 hover:text-[var(--btn)] transition-colors underline decoration-dotted flex items-center gap-2"
        >
          <i class="bi bi-arrow-counterclockwise"></i>
          Importer un autre fichier
        </button>
      </div>

    </div>

    <div v-if="!isProcessing && !stats.finished" class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs opacity-40">
      <div class="flex flex-col items-center gap-1">
        <i class="bi bi-google text-lg"></i>
        <span>takeout.google.com</span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <i class="bi bi-check2-square text-lg"></i>
        <span>Cochez "Keep" uniquement</span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <i class="bi bi-file-zip text-lg"></i>
        <span>Téléchargez le ZIP</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Ces styles supposent que tu as déjà défini tes variables CSS globales 
  (--bg, --bg2, --btn, --text-little, etc.) dans ton projet.
*/

.loader-icon {
  animation: pulse-scale 2s ease-in-out infinite;
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.95); opacity: 0.8; }
}
</style>