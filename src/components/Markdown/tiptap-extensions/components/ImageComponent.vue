<template>

    <node-view-wrapper 
        class="group relative p-4 block w-fit select-none"
    >

        <div class="relative inline-block max-w-full leading-0">
        
            <div  
                class="
                    absolute -top-3 right-2 z-50
                    flex items-center gap-1 rounded-xl
                    border border-(--text)/5 bg-(--white)
                    shadow-lg p-1
                    
                    transition-all duration-300
                    opacity-0 group-hover:opacity-100
                    -translate-y-10 group-hover:translate-y-0
                    pointer-events-none group-hover:pointer-events-auto
                "
                :class="{ 'pointer-events-auto translate-y-0 opacity-100': selected }"
            >

                <div class="flex items-center gap-0.5">

                    <a 
                        class="h-full p-1"
                        @click="updateImgSrc" 
                    >
                        Remplacer
                    </a>
                    
                    <div class="mx-1 h-4 w-px bg-gray-200" />
                    
                    <a 
                        @click="downloadImage" 
                        title="Télécharger"
                        class="p-1"
                    >
                        <i class="bi bi-download text-sm" />
                    </a>
                    
                    <a 
                        @click="deleteNode" 
                        class="p-1 red"
                        title="Supprimer"
                    >
                        <i class="bi bi-trash3 text-sm" />
                    </a>
                    
                </div>

            </div>

            <img 
                :src="node.attrs.src" 
                :alt="node.attrs.alt"
                :title="node.attrs.title"
                class="
                    cursor-pointer rounded-xl 
                    transition-all duration-300
                    max-w-full h-auto
                    group-hover:opacity-80
                "
                :class="{ 'opacity-80': selected }"
                loading="lazy"
            >

        </div>

    </node-view-wrapper>

</template>

<script setup lang="ts">

import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

const props = defineProps(nodeViewProps);

const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = (error) => reject(error);
    });
};

const updateImgSrc = () => {

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event) => {
        
        const target: EventTarget | null = event.target;
        const as = target as HTMLInputElement;

        const file = as.files?.[0];
        console.log(file || 'no file')

        if (file)
        {

            const url = await convertToBase64(file);
            props.updateAttributes({ src: url, alt: file.name });

        }

    }

    input.click();

}

const downloadImage = () => {
    const link = document.createElement('a')
    link.href = props.node.attrs.src
    link.download = props.node.attrs.alt || 'image'
    link.target = '_blank'
    link.click()
}

const deleteNode = () => {
    props.deleteNode()
}

</script>

<style scoped>
@import '../../../../style.css';
</style>