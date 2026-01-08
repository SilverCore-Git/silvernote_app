<template>
    
    <div
        class="
            bg-(--white) rounded-[2rem] p-8 shadow-sm max-w-2xl w-full mx-auto border border-gray-100/50
        "
    >
        
        <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-3">
                <div class="text-gray-900">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-music">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M20 3a1 1 0 0 1 1 1v13a4 4 0 1 1 -7.832 -1.545l.082 -5.555l-7.75 .1l.081 4.455a4 4 0 1 1 -7.831 -1.545v-9.91l11 -1.916v-1.124a1 1 0 0 1 1 -1z" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">Pitch SilverTransfert</h2>
            </div>

            <span class="bg-[#F3E8FF] text-[#A855F7] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                SilverTransfert
            </span>
        </div>

        <div class="space-y-4">
            <p class="text-gray-500 italic text-lg leading-relaxed">
                "Marre des services qui promettent la sécurité sans la chiffrer vraiment..."
            </p>

            <p class="text-gray-800 text-lg leading-relaxed">
                SilverTransfert chiffre tes fichiers de bout en bout — personne ne regarde, même pas nous.
            </p>
        </div>

    </div>

</template>

<script lang="ts" setup>

defineProps<{
    title: string;
    content: string;
    icon: string;
    tags: number[];
}>();

</script>