<template>

    <Teleport to="body">

        <div>

            <div 
                class="fixed right-6 bottom-6"
                @click="showMenu = !showMenu"
            >
                <button 
                    class="
                        scale rounded-full w-16 h-16
                        flex justify-center items-center
                        bg-(--btn) p-2 cursor-pointer
                    "
                >
                    <i class="text-3xl text-white bi bi-pencil-square" />
                </button>
            </div>

            <MdInputMenuAbsolute
                :bottom="100"
                :right="24"
                v-model:show="showMenu"
                type="insert"
                position="fixed"
                :close-on-click="true"
            />

        </div>

    </Teleport>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import MdInputMenuAbsolute from './ToolsMenu/mdInputType/mdInputMenuAbsolute.vue';

const showMenu = ref<boolean>(false);

</script>