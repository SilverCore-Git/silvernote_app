<template>

  <teleport to="body">

    <transition name="fade-slide">

      <div
          v-if="visible"
          @click="cancel"
          class="fixed inset-0 z-50 flex items-center justify-center"
          style="
              background-color: #00000090;
              backdrop-filter: blur(5px);
          "
      >

          <div 
            class="bg-[var(--bg2)] rounded-md shadow-md p-4 m-3 
                    w-full max-w-sm text-sm"
            @click.stop=""
          >

              <h2 class="text-base font-semibold mb-2">{{ title }}</h2>

              <p class="mb-4">{{ message }}</p>

              <div class="flex justify-end gap-2">

                  <button
                      class="second"
                      @click.stop="cancel"
                      >
                      Annuler
                  </button>

                  <button
                      class="danger primary"
                      @click.stop="confirm"
                      >
                      Confirmer
                  </button>

              </div>

          </div>

      </div>

    </transition>

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
