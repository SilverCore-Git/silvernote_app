<script setup lang="ts">

import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from '@clerk/vue';
import OnboardingLayout from './OnboardingLayout.vue';
import StepStart from './views/StepStart.vue';
import StepImport from './views/StepImport.vue';
import StepApparence from './views/StepApparence.vue';
import ImportKeep from './views/import-keep.vue';
import TransitionPortal from './TransitionPortal.vue';

const props = defineProps<{ page: 'start' | 'apparence' | 'import' | 'done' }>();
const router = useRouter();
const { user } = useUser();
const loading = ref<boolean>(false);
const isTransitioning = ref<boolean>(false);

const selection = reactive({ apparence: '', imports: [] as string[] });

const importSources = [
  { 
    id: 'keep', 
    name: 'Google Keep', 
    icon: 'https://cdn.simpleicons.org/googlekeep'
  },
  { 
    id: 'apple', 
    name: 'Apple Notes', 
    icon: 'https://cdn.simpleicons.org/apple'
  },
  { 
    id: 'notion', 
    name: 'Notion HTML', 
    icon: 'https://cdn.simpleicons.org/notion'
  },
  { 
    id: 'md', 
    name: 'Fichiers Markdown', 
    icon: 'https://cdn.simpleicons.org/markdown/0081ff'
  }
];


const stepsOrder = computed(() => {
  const base = ['start', 'apparence', 'import'];
  const dynamicImports = selection.imports.map(id => `import-${id}`);
  return [...base, ...dynamicImports, 'done'];
});

const navigate = (direction: 'next' | 'back') => {
  const currentIndex = stepsOrder.value.indexOf(props.page);
  
  if (direction === 'next') {
    const nextStep = stepsOrder.value[currentIndex + 1];
    if (nextStep) router.push(`/onboarding/${nextStep}`);
  } else {
    const prevStep = stepsOrder.value[currentIndex - 1];
    if (prevStep) router.push(`/onboarding/${prevStep}`);
  }
};

const toggleImport = (id: string) => {
  const i = selection.imports.indexOf(id);
  i > -1 ? selection.imports.splice(i, 1) : selection.imports.push(id);
};

const complete = async () => {

  isTransitioning.value = true;
  setTimeout(() => {
    loading.value = true;
  }, 1000)

  try {

    if (user.value) 
    {
      await user.value.update({ unsafeMetadata: { onboarding: 'completed' } });
    }

    setTimeout(() => {
      isTransitioning.value = false;
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }, 1000);

  } 
  catch (e) 
  {
    console.error(e);
    isTransitioning.value = false;
  }

};

</script>

<template>

  <OnboardingLayout 
    v-if="!loading"
    :page="page" 
    :selectedImports="selection.imports"
    @next="navigate('next')" 
    @back="navigate('back')"
  >

    <StepStart v-if="page === 'start'" :name="user?.firstName" @next="navigate('next')" />
    
    <StepApparence v-else-if="page === 'apparence'" v-model="selection.apparence" />
    
    <StepImport v-else-if="page === 'import'" :selected="selection.imports" :sources="importSources" @toggle="toggleImport" />

    <import-keep v-else-if="page.startsWith('import-')" :selected="selection.imports" />
    
    <div v-else-if="page === 'done'" class="flex flex-col items-center text-center justify-center h-full">
      <div class="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce-slow"><i class="bi bi-stars"></i></div>
      <h2 class="text-2xl font-bold mb-4">Prêt à commencer ?</h2>
      <button @click="complete" class="premium" :disabled="loading"><span class="text-xl">C'est parti !</span></button>
    </div>

  </OnboardingLayout>

  <TransitionPortal :show="isTransitioning" />
  
</template>
