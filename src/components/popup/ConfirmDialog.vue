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

              <div :class="checkbox ? '' : 'mb-5'">
                <h2 class="text-lg font-black tracking-tight text-(--text) mb-2">{{ title || 'Confirmation' }}</h2>
                <p class="text-(--text-little) leading-relaxed">{{ message }}</p>
              </div>

              <div v-if="checkbox" class="my-5">
                <input type="checkbox" id="confirm-checkbox" v-model="checkboxModel" class="peer hidden" />
                <label
                  for="confirm-checkbox"
                  class="inline-flex items-center cursor-pointer select-none text-(--text)/70 leading-relaxed"
                >
                  <span>
                    {{ checkboxText }}
                  </span>
                </label>
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
import { ref } from 'vue';
import BackdropOverlay from '../common/BackdropOverlay.vue';


const props = defineProps<{
  visible: boolean;
  title?: string;
  message: string;
  checkbox?: boolean;
  checkboxText?: string;
}>()

const emits = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const checkboxModel = ref<boolean>(false);

const confirm = () => {
  if (checkboxModel.value === false && props.checkbox) {
    return;
  }
  emits('confirm')
}
const cancel = () => emits('cancel')

</script>