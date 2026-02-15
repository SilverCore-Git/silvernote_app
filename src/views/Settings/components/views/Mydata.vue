<script setup lang="ts">

import { Notes, SharedNotes, Tags } from '@/assets/ts/database/Var';
import { onMounted, ref } from 'vue';
import DownloadDBToSnote from '../../utils/DownloadDBToSNOTE';
import DownloadDBToJSON from '../../utils/DownloadDBToJSON';
import ConfirmDialog from '@/components/popup/ConfirmDialog.vue';
import database from '@/assets/ts/database/database';
import UploadFromSNOTE from '../../utils/UploadFromSNOTE';
import { api_url } from '@/assets/ts/backend_link';
import useToken from '@/composables/useToken';
import { useRouter } from 'vue-router';

const router = useRouter();
const Loader = ref<string>('');
const ShowConfirmDialog = ref<boolean>(false);
const file_input = ref<HTMLInputElement | undefined>(undefined);
const fingerPrint = ref<string>('');
const showFingerprint = ref<boolean>(false);
const eatNotesTotal = ref<number | undefined>(undefined);
const eatNotesCurent = ref<number | undefined>(undefined);


const exportFormats = [
  { id: 'snote', label: 'Format natif (.snote)', description: 'Idéal pour sauvegarder et restaurer sur un autre compte.' },
//   { id: 'md', label: 'Markdown (.zip)', description: 'Exportez vos notes pour les utiliser dans Obsidian ou Notion.' },
  { id: 'json', label: 'Données brutes (.json)', description: 'Toutes vos données structurées pour les développeurs.' },
//   { id: 'pdf', label: 'Documents (.pdf)', description: 'Uniquement pour la lecture et l\'impression.' },
];

const open_input = () => file_input.value?.click();

const exportData = (format: string) => {

    if (format == 'snote')
    {
        Loader.value = 'snote';
        DownloadDBToSnote()
            .then(() => {
                setTimeout(() => {
                    Loader.value = '';
                }, 200)
            });
    }
    else if (format == 'json')
    {
        Loader.value = 'snote';
        DownloadDBToJSON()
            .then(() => {
                setTimeout(() => {
                    Loader.value = '';
                }, 200)
            });
    }

};

const uploadData = (event: Event) => {
    Loader.value = 'upload';

    eatNotesTotal.value = 0;
    eatNotesCurent.value = 0;

    UploadFromSNOTE({
        event,
        onEnd: () => {
            eatNotesTotal.value = undefined;
            eatNotesCurent.value = undefined;
            setTimeout(() => {
                Loader.value = '';
            }, 200)
        },
        onProgress: (current, total) => {
            eatNotesCurent.value = current;
            eatNotesTotal.value = total;
        }
    })
}

const resetDB = async (state: 1 | 2) => {
    if (state == 1) 
    {
        ShowConfirmDialog.value = true;
    }
    else if (state == 2)
    {
        Loader.value = 'reset';

        await database.reset();
        Notes.value = [];
        Tags.value = [];
        SharedNotes.value = [];
    
        Loader.value = '';
    }
}


onMounted(async () => {
    fingerPrint.value = await fetch(`${api_url}/api/db/get/scrypto/fingerprint`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${await useToken() || ''}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(res => res.json()).then(data => data.fingerprint || '');
});

</script>

<template>

    <div class="min-h-full max-w-5xl mx-auto w-full p-8 bg-(--bg) transition-colors duration-300">
        
        <header class="mb-8">
            <h1 class="font-bold text-3xl mb-2 tracking-tight">
                Mes Données
            </h1>
            <p class="opacity-60 text-sm">
                Gérez, exportez et contrôlez l'ensemble de vos informations stockées.
            </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            <div class="p-5 rounded-xl bg-(--bg2) border border-(--white)/10">
                <div class="text-xs opacity-60 uppercase tracking-wider mb-1">Notes Total</div>
                <div class="text-3xl font-bold text-(--btn)">{{ Notes.length }}</div>
            </div>

            <div class="p-5 rounded-xl bg-(--bg2) border border-(--white)/10">
                <div class="text-xs opacity-60 uppercase tracking-wider mb-1">Tags Total</div>
                <div class="text-3xl font-bold text-(--btn)">{{ Tags.length }}</div>
            </div>

        </div>

        <section class="mb-8 p-6 rounded-xl bg-(--bg2) border border-(--white)/10">
                
            <h2 class="font-semibold text-lg mb-6 flex items-center gap-2">
                <i class="bi bi-box-arrow-up text-(--btn)" /> Exporter mes données
            </h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <div 
                    v-for="format in exportFormats" 
                    :key="format.id"
                    class="group p-4 rounded-lg border border-(--white)/10 bg-(--bg) hover:border-(--btn)/50 transition-all cursor-pointer"
                    @click="exportData(format.id)"
                >

                    <div class="flex justify-between items-start mb-1">
                        <span class="font-bold text-(--btn) uppercase text-sm">{{ format.id }}</span>
                        <i v-if="Loader == format.id" class="transition-opacity bi bi-arrow-repeat text-(--btn) turn" />
                        <i v-else class="opacity-0 group-hover:opacity-100 transition-opacity bi bi-download text-(--btn)" />
                    </div>

                    <div class="font-medium text-sm mb-1">{{ format.label }}</div>
                    <div class="text-xs opacity-50">{{ format.description }}</div>

                </div>

            </div>

        </section>

        <section class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            <div class="p-6 rounded-xl bg-(--bg2) border border-(--white)/10">

                <h2 class="font-semibold text-lg mb-4 flex items-center gap-2">
                    <i class="bi bi-box-arrow-down text-(--btn)" />
                    Importer des notes et tags
                </h2>

                <p class="text-sm opacity-60 mb-4">Fusionnez vos notes depuis google keep ou un fichier .snote.</p>

                <button 
                    class="second w-full mb-2"
                    @click="router.push('/onboarding/import')"
                >
                    Importer depuis google keep
                </button>

                <button 
                    class="second w-full"
                    @click="router.push('/onboarding/import')"
                >
                    Importer depuis un fichier .snote 
                </button>

            </div>

            <div class="p-6 rounded-xl border border-red-500/20 bg-red-500/5">

                <h2 class="text-red-500 font-semibold text-lg mb-2 flex items-center gap-2">
                    <i class="bi bi-exclamation-triangle" /> Réinitialiser la base de données
                </h2>

                <div class="flex flex-col items-start  gap-4">
                    <p class="text-sm text-red-500/70">
                        Vider vôtre base de donnés. Supprimer toutes vos notes et vos tags (cette action est irreversible).
                    </p>
                    <button 
                        @click="resetDB(1)"
                        class="second danger w-full"
                        :class="Loader == 'reset' ? 'loader' : ''"
                    >
                        Supprimer tout
                    </button>
                </div>

            </div>

        </section>

        <section 
            class="mb-8 p-6 rounded-xl bg-(--bg2) border border-(--white)/10 overflow-hidden relative"
            v-if="fingerPrint && fingerPrint != ''"
        >

            <i class="bi bi-shield-lock-fill absolute -right-4 -top-4 text-4xl opacity-5 text-(--btn)" />

            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

                <div>
                    <h2 class="font-semibold text-lg mb-1 flex items-center gap-2">
                        <i class="bi bi-shield-check text-(--btn)" /> Chiffrement des données
                    </h2>
                    <p class="text-xs opacity-60 max-w-md">
                        Vos notes sont protégées par un chiffrement <strong>AES-256-GCM</strong>. 
                        Chaque utilisateur possède une clé d'isolation unique dérivée de notre clé maître.
                    </p>
                </div>

                <div class="flex flex-col items-end">
                    
                    <div class="text-[10px] opacity-40 uppercase tracking-widest mb-1 font-bold">
                        Code de sécurité (Fingerprint)
                    </div>
                    
                    <div 
                        class="flex items-center gap-2 bg-(--bg) px-4 py-2 rounded-lg border border-(--white)/5 group relative"
                        title="Ceci est une empreinte unique de votre clé de sécurité."
                    >
                        
                        <code 
                            v-if="showFingerprint" 
                            class="text-(--btn) font-mono font-bold tracking-wider text-sm cursor-help"
                        >
                            {{ fingerPrint }}
                        </code>

                        <div 
                            v-else 
                            class="
                                h-5 w-full bg-(--white)/5 animate-pulse
                                rounded text-(--text)/80 font-mono font-bold
                                tracking-wider text-sm cursor-pointer
                            "
                            @click="showFingerprint = true"
                        >
                            <span class="text-transparent">A-AAAA-AAAA</span>
                            voir le code
                            <span class="text-transparent">A-AAAA-AAAA</span>
                        </div>
                        
                        <i 
                            class="bi bi-info-circle text-xs opacity-30 group-hover:opacity-100 transition-opacity" 
                        />

                    </div>

                    <p class="text-[9px] opacity-40 mt-2 italic text-right">
                        Vérifié par Silvernote Security Stack
                    </p>
            
                </div>
            
            </div>

        </section>

    </div>

    <ConfirmDialog
        :visible="ShowConfirmDialog"
        title="Réinitialiser la base de données"
        message="Cette action est irréversible. Êtes-vous sûr de vouloir réinitialiser votre base de données ? Toutes vos notes et tags seront supprimés définitivement."
        checkbox="Je comprends les conséquences de cette action"
        @cancel="ShowConfirmDialog = false"
        @confirm="resetDB(2); ShowConfirmDialog = false"
    />

</template>