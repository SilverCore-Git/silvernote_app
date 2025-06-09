<template>

  <teleport to="body">

    <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="
            background-color: #00000090;
            backdrop-filter: blur(5px);
        "
    >

        <div class="bg-white rounded-md shadow-md p-4 m-3 w-full max-w-sm text-sm">

            <h2 class="text-base font-semibold mb-2">{{ title }}</h2>

            <p class="mb-4">{{ message }}</p>

            <div class="flex justify-end gap-2">

                <button
                    class="px-3 py-1 rounded border hover:bg-gray-200 cursor-pointer"
                    @click="cancel"
                    >
                    Annuler
                </button>

                <button
                    class="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-900 cursor-pointer"
                    @click="confirm"
                    >
                    Confirmer
                </button>

            </div>

        </div>

    </div>

  </teleport>

</template>

<script setup lang="ts">

import { defineProps, defineEmits } from 'vue'

defineProps<{
  visible: boolean
  title?: string
  message: string
}>()

const emits = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const confirm = () => emits('confirm')
const cancel = () => emits('cancel')

</script>
