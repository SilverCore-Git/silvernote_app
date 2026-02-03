<style scoped>
.pulse {
  animation: pulse-animation 200ms infinite ease-in-out;
}

@keyframes pulse-animation {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>

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

              <div v-if="checkbox" class="my-4">

                <checkbox
                  v-model="checkboxVal"
                >

                  <span 
                    :class="enterWithNoCheckbox ? 'text-red-500 transition-all duration-200 pulse' : ''"
                  >{{ checkbox }}</span>

                </checkbox>

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
import Checkbox from '../inputs/Checkbox.vue';


const props = defineProps<{
  visible: boolean;
  title?: string;
  message: string;
  checkbox?: string;
}>()

const emits = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const checkboxVal = ref<boolean>(false);
const enterWithNoCheckbox = ref<boolean>(false);

const confirm = () => {
  if (props.checkbox && !checkboxVal.value)
  {
    enterWithNoCheckbox.value = true;
    setTimeout(() => enterWithNoCheckbox.value = false, 400);
    return;
  }
  emits('confirm')
}
const cancel = () => emits('cancel')

</script>