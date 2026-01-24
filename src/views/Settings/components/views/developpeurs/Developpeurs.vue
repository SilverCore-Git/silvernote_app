<script setup lang="ts">
import downloadEditorSchema from './utils/downloadEditorSchema';



</script>

<template>

    <div class="min-h-screen w-full p-8 bg-(--bg) transition-colors duration-300">
        
        <header class="mb-8">
            <h1 class="font-bold text-3xl mb-2 tracking-tight">
                Accès développeurs
            </h1>
            <p class="opacity-60 text-sm">
                
            </p>
        </header>

        <section class="mb-8 p-6 rounded-xl bg-(--bg2) border border-(--white)/10">
                
            <h2 class="font-semibold text-lg mb-6 flex items-center gap-2">
                <i class="bi bi-pencil-square text-(--btn)" /> TipTap Editor
            </h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <div class="p-4 rounded-lg border border-(--white)/10 bg-(--bg) flex justify-between items-center">
                    <span>Download prosemirroir schéma</span>
                    <button class="primary" @click="downloadEditorSchema">Download</button>
                </div>

            </div>

        </section>


    </div>

</template>