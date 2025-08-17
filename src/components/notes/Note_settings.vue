<template>
  
    <teleport to="body">
        
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
            
            <div class="w-full max-w-sm p-6 rounded-2xl shadow-lg bg-[var(--bg2)] m-4">
                
                <h1 class="text-2xl font-bold text-center tracking-wider mb-6">
                    Paramètres de la note
                </h1>
                
                <section class="my-10">

                    <label
                        for="type_of_note"
                        class="block text-sm font-medium mb-2"
                    >
                        Type de note :
                    </label>

                    <select
                        v-if="note_with_parms!.type"
                        id="type_of_note"
                        name="type_of_note"
                        v-model="note_with_parms!.type"
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-[var(--btn)] transition-all duration-200"
                    >
                        <option value="text">Texte</option>
                        <option value="todolist">Liste de tâches</option>
                        <option value="paint">Dessin</option>
                    </select>

                    <div v-else class="animate-pulse bg-gray-300 h-10 rounded-lg"></div>

                </section>

                <button
                    class="primary w-full"
                >
                    Sauvegarder
                </button>

                <button
                    class="second danger w-full mt-2"
                >
                    Fermer
                </button>

            </div>

        </div>
        
    </teleport>
    
</template>



<script setup lang="ts">

import { onMounted, ref } from 'vue';

import db from '@/assets/ts/database';
import type { Note } from '@/assets/ts/type';

const props = defineProps<{
    id: number;
}>()


const note_with_parms = ref<Note | null>(null);

onMounted(async () => {
  const note = await db.getNote(props.id);

  if (note) {
    note_with_parms.value = {
      ...note,
      type: note.type ?? 'text', 
    };

  } else {
    
    note_with_parms.value = {
      id: props.id,
      type: 'text',
      content: '',
    } as Note;
    
  }
});

</script>

