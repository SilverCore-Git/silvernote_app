<template>

  <teleport to="body">

    <backdrop-overlay v-if="visible" />

    <transition name="fade-slide">

      <div
          v-if="visible"
          @click="cancel"
          class="fixed inset-0 z-150 flex items-center justify-center p-4 "
      >

          <div 
            class="bg-(--bg) border border-(--text)/5 rounded-2xl shadow-2xl p-6 w-full max-w-sm overflow-hidden relative group"
            @click.stop=""
          >

              <div class="mb-5">
                <h2 class="text-lg font-black tracking-tight text-(--text) mb-2">{{ title || 'Confirmation' }}</h2>
                <p class="text-(--text-little) leading-relaxed">{{ message }}</p>
              </div>

              <div class="flex justify-end gap-3 mt-8">
                  <button
                      class="default"
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
import BackdropOverlay from '../common/BackdropOverlay.vue';


defineProps<{
  visible: boolean;
  title?: string;
  message: string;
}>()

const emits = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const confirm = () => emits('confirm')
const cancel = () => emits('cancel')

</script>