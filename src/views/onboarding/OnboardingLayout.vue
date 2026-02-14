<template>

  <div 
    class="
      relative w-full h-screen 
      overflow-hidden flex 
      items-center justify-center 
      bg-(--bg) text-(--text)
    "
  >
    
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-(--btn)/20 rounded-full blur-[100px]" />
      <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-(--btn)/20 rounded-full blur-[100px]" />
      <div class="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-(--btn)/20 rounded-full blur-[100px]" />
    </div>

    <div 
      class="
        relative w-full max-w-4xl min-h-[550px] z-10 
        flex flex-col md:flex-row bg-(--white)/60
        backdrop-blur-xl border border-(--text)/10 
        rounded-3xl shadow-2xl overflow-hidden
      "
    >
      
      <div 
        class="
          w-full md:w-1/3 p-8 bg-(--bg2)
          flex flex-col justify-between 
          border-r border-(--text)/5
        "
      >

        <div>
          <h1 class="font-bold text-2xl mb-2 flex items-center gap-2">
            <img src="/favicon.svg" class="w-8 rounded-md shadow-sm" />
            Silvernote
          </h1>
          <p class="text-xs opacity-60">Configuration de l'espace de travail.</p>
        </div>

        <div class="space-y-4 my-8">

          <div 
            v-for="(stepId, index) in stepsOrder" 
            :key="stepId"
            class="flex items-center gap-4 transition-all duration-300"
            :class="[
              page === stepId ? 'opacity-100' : 'opacity-40',
              stepId.startsWith('import-') ? 'ml-6' : ''
            ]"
          >

            <div 
              class="
                w-7 h-7 rounded-full 
                flex items-center justify-center 
                text-[10px] font-bold border transition-all
              "
              :class="
                currentIndex >= index 
                  ? 'bg-(--btn) border-(--btn) text-white shadow-lg shadow-(--btn)/20' 
                  : 'border-(--text)/30'
              "
            >
              <i v-if="currentIndex > index" class="bi bi-check-lg text-xs" />
              <span v-else>{{ index + 1 }}</span>
            </div>

            <div class="flex flex-col">
              <span class="text-sm font-semibold tracking-tight">{{ stepsLabels[stepId] }}</span>
              <span v-if="stepId.startsWith('import-')" class="text-[9px] uppercase opacity-60 font-bold tracking-tighter">
                Importation
              </span>
            </div>

          </div>

        </div>

        <div class="text-[10px] font-bold opacity-30 uppercase tracking-widest">
          Étape {{ currentIndex + 1 }} / {{ stepsOrder.length }}
        </div>

      </div>

      <div class="w-full md:w-2/3 p-10 relative flex flex-col overflow-hidden">
        
        <div class="flex-1">
          <transition :name="transitionName" mode="out-in">
            <slot :key="page" />
          </transition>
        </div>

        <div 
          v-if="page !== 'start' && page !== 'done'" 
          class="mt-auto flex justify-between items-center pt-8 border-t border-(--text)/5 bg-transparent"
        >
          <button 
            @click="$emit('back')" 
            class="default"
          >
            Retour
          </button>

          <button 
            @click="canPass ? $emit('next') : console.log('')" 
            class="primary"
            :class="!canPass ? 'grayscale-100 cursor-not-allowed!' : ''"
          >
            Continuer
          </button>
        </div>

      </div>

    </div>

  </div>

</template>

<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{ 
  page: string, 
  selectedImports: string[] 
}>();

defineEmits(['next', 'back']);

const route = useRoute();
const canPass = ref<boolean>(route.query.canPass !== undefined ? route.query.canPass === '1' : true);

const stepsConfigBase: Record<string, string> = { 
  start: 'Bienvenue', 
  apparence: 'Apparence', 
  import: 'Sources', 
  done: 'Finalisation' 
};

const importNames: Record<string, string> = {
  keep: 'Google Keep',
  notion: 'Notion',
  apple: 'Apple Notes',
  md: 'Markdown'
};

const stepsOrder = computed(() => {
  const baseSteps = ['start', 'apparence', 'import'];
  const dynamicSteps = props.selectedImports.map(id => `import-${id}`);
  return [...baseSteps, ...dynamicSteps, 'done'];
});

const stepsLabels = computed(() => {
  const labels = { ...stepsConfigBase };
  props.selectedImports.forEach(id => {
    labels[`import-${id}`] = importNames[id] || id;
  });
  return labels;
});

const currentIndex = computed(() => stepsOrder.value.indexOf(props.page));
const transitionName = ref('slide-left');

watch(() => props.page, (newVal, oldVal) => {
  const newIdx = stepsOrder.value.indexOf(newVal);
  const oldIdx = stepsOrder.value.indexOf(oldVal);
  transitionName.value = newIdx > oldIdx ? 'slide-left' : 'slide-right';
});

watch(() => route.query.canPass, (newVal) => {
  canPass.value = newVal === '1';
})

</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from { opacity: 0; transform: translateX(140px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-140px); }

.slide-right-enter-from { opacity: 0; transform: translateX(-140px); }
.slide-right-leave-to { opacity: 0; transform: translateX(140px); }
</style>