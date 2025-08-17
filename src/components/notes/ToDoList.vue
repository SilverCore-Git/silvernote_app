<template>
        
    <div class="container">
        
        <draggable v-model="ToDo" item-key="id" animation="200" handle=".drag-handle">
        
            <template #item="{ element: Do }">
                
                <li class=" border-b border-[var(--btn)] w-full flex justify-start items-center py-1.5">

                    <div class="flex items-center gap-2 w-full">
                    
                        <span class="drag-handle cursor-grab">⠿</span>

                        <label class="flex items-center">

                            <input v-model="Do.active" type="checkbox" class="hidden" />
                            <span 
                                class="w-5 h-5 rounded-full border-2 inline-block"
                                :class="Do.active ? 'bg-[var(--btn)]' : ''"
                            ></span>

                        </label>

                        <input
                            v-model="Do.content"
                            type="text"
                            placeholder="Nom de la tâche"
                            class="ml-1 outline-0 w-full"
                            :class="Do.active ? 'line-through' : ''"
                        />
                    
                    </div>

                    <div class="flex justify-end items-center gap-2 mr-1">
                    
                        <div @click="del_a_do(Do.id)" class="svg bin w-[21px] h-[21px]"></div>

                    </div>

                </li>
            
            </template>
            
        </draggable>

        <li @click="add_a_do()" class="mb-10 w-full flex justify-start items-center py-1.5 cursor-pointer">
            <div class="svg plus block w-7 h-7"></div>
            <span class="hover:text-[var(--btn)] ml-2">Ajouter une tâche</span>
        </li>

    </div>

</template>

<script lang="ts" setup>

import { ref, watch } from "vue";
import draggable from "vuedraggable";

//import db from '../../assets/ts/database';

interface ToDoType { 
    id: number; 
    content: string; 
    active: boolean; 
}

const props = defineProps<{
    id?: number;
    data?: ToDoType[];
}>()

const ToDo = ref<ToDoType[]>(props.data || []);

const add_a_do = (Do?: string) => {
    ToDo.value.push({
        id: Date.now(),
        content: Do || "",
        active: false
    });
};

const del_a_do = (id: number) => {
    ToDo.value = ToDo.value.filter(Ado => Ado.id !== id);
}

const saveContent = () => {
    // if (ToDo.value) {
    //     db.saveContent(JSON.stringify(ToDo.value), props.id)
    // }
}

watch(ToDo.value, saveContent);

</script>

<style scoped>

.container {
  width: 90%;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
}

.drag-handle {
  font-size: 18px;
  user-select: none;
}

.svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.bin {
    background-image: url('/assets/svgs/bin.svg');
    filter: brightness(0) saturate(100%) invert(19%) sepia(94%) saturate(7458%) hue-rotate(359deg) brightness(94%) contrast(112%);
}

.plus {
    background-image: url('../../assets/svgs/plus.svg');
    filter: brightness(0) saturate(100%) invert(61%) sepia(43%) saturate(1182%) hue-rotate(343deg) brightness(99%) contrast(92%);
}

</style>
