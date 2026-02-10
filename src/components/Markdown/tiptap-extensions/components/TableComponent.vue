<template>

    <node-view-wrapper class="table-node-view group/table relative my-8 ml-2 mr-6">

        <div  
            class="
                absolute -top-3 right-2 z-50
                flex items-center gap-1 rounded-xl
                border border-(--text)/5 bg-(--white)
                shadow-lg p-1
                
                transition-all duration-300
                opacity-0 group-hover/table:opacity-100
                -translate-y-10 group-hover/table:translate-y-0
                pointer-events-none group-hover/table:pointer-events-auto
            "
            :class="{ 'pointer-events-auto translate-y-0 opacity-100': selected }"
            contenteditable="false"
        >

            <div class="flex items-center gap-0.5">
            
                <a 
                    @click="addColumnBefore" 
                    class="p-1" 
                    title="Ajouter avant"
                >
                    <i class="bi bi-node-plus" />
                </a>
                
                <a 
                    @click="addColumnAfter" 
                    class="p-1" 
                    title="Ajouter après"
                >
                    <i class="bi bi-node-plus-fill" />
                </a>
                
                <a 
                    @click="deleteColumn" 
                    class="p-1 red" 
                    title="Supprimer colonne"
                >
                    <i class="bi bi-node-minus" />
                </a>
                

                <div class="mx-1 h-4 w-px bg-gray-200" />

                <a 
                    @click="addRowBefore" 
                    class="p-1" 
                    title="Ligne avant"
                >
                    <i class="bi bi-file-earmark-plus" />
                </a>
                
                <a 
                    @click="addRowAfter" 
                    class="p-1" 
                    title="Ligne après"
                >
                    <i class="bi bi-file-earmark-plus-fill" />
                </a>
                
                <a 
                    @click="deleteRow" 
                    class="p-1 red" 
                    title="Supprimer ligne"
                >
                    <i class="bi bi-file-earmark-x" />
                </a>


                <div class="mx-1 h-4 w-px bg-gray-200" />

                <a 
                    @click="mergeOrSplit" 
                    class="p-1" 
                    title="Fusionner/Scinder"
                >
                    <i class="bi bi-grid-1x2" />
                </a>
                
                <a 
                    @click="toggleHeader" 
                    class="p-1" 
                    title="En-tête"
                >
                    <i class="bi bi-layout-three-columns" />
                </a>


                <div class="mx-1 h-4 w-px bg-gray-200" />
                
                <a 
                    @click="deleteTable" 
                    class="p-1 red" 
                    title="Supprimer tableau"
                >
                    <i class="bi bi-trash3 text-sm" />
                </a>
            
            </div>

        </div>

        <div 
            class="absolute -right-6 inset-y-0 w-6 flex items-center justify-center opacity-0 group-hover/table:opacity-100 transition-opacity"
            contenteditable="false"
        >
            <a 
                @click="addColumnAfter" 
                class="h-full flex justify-center items-center"
                title="Ajouter une colonne"
            >
                <i class="bi bi-plus-lg" />
            </a>
        </div>

        <div 
            class="absolute -bottom-6 inset-x-0 h-6 flex items-center justify-center opacity-0 group-hover/table:opacity-100 transition-opacity"
            contenteditable="false"
        >
            <a 
                @click="addRowAfter" 
                class="w-full flex justify-center items-center"
                title="Ajouter une ligne"
            >
                <i class="bi bi-plus-lg" />
            </a>
        </div>

        <div class="table-container">
            <table class="prose">
                <node-view-content />
            </table>
        </div>

    </node-view-wrapper>

</template>

<script setup>

import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

const props = defineProps(nodeViewProps);

const addColumnBefore = () => props.editor.chain().focus().addColumnBefore().run();
const addColumnAfter = () => props.editor.chain().focus().addColumnAfter().run();
const deleteColumn = () => props.editor.chain().focus().deleteColumn().run();
const addRowBefore = () => props.editor.chain().focus().addRowBefore().run();
const addRowAfter = () => props.editor.chain().focus().addRowAfter().run();
const deleteRow = () => props.editor.chain().focus().deleteRow().run();
const deleteTable = () => props.editor.chain().focus().deleteTable().run();
const mergeOrSplit = () => props.editor.chain().focus().mergeOrSplit().run();
const toggleHeader = () => props.editor.chain().focus().toggleHeaderRow().run();

</script>

<style scoped>

@reference '../../../../style.css';

.table-node-view {
    transition: all 0.2s ease;
}

.table-container {
    border-radius: var(--br-card);
    border: 1px solid var(--bg2);
    width: 100%;
    overflow: hidden;
    background: var(--white);
    box-shadow: 0 4px 12px var(--shadow);
    z-index: 10;
    position: relative;
}

:deep(table) {
    width: 100% !important;
    border-collapse: collapse;
    margin: 0 !important;
    table-layout: fixed;
}

:deep(th), :deep(td) {
    min-width: 25px;
    border: 1px solid var(--bg2);
    padding: 10px 12px;
    position: relative;
    text-align: left;
    box-sizing: border-box;
}

:deep(th) {
    background-color: var(--bg);
    color: var(--text-strong);
    font-weight: 700;
}

/* Handle de resize */
:deep(.column-resize-handle) {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: var(--btn);
    cursor: col-resize;
    z-index: 50;
    opacity: 0;
}

:deep(th:hover .column-resize-handle),
:deep(td:hover .column-resize-handle) {
    opacity: 1;
}

:deep(p) {
    margin: 0 !important;
}

</style>