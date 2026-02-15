<script setup lang="ts">

import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from '@clerk/vue';

import OnboardingLayout from './OnboardingLayout.vue';

import StepStart from './views/StepStart.vue';
import StepImport from './views/StepImport.vue';
import StepApparence from './views/StepApparence.vue';
import ImportKeep from './views/import-keep.vue';
import ImportSnote from './views/import-snote.vue';
import TransitionPortal from './TransitionPortal.vue';
import StepDone from './views/StepDone.vue';

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
    id: 'snote', 
    name: 'Silvernote', 
    icon: '/favicon.png'
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

    <import-keep v-else-if="page.startsWith('import-keep')" :selected="selection.imports" />

    <import-snote v-else-if="page.startsWith('import-snote')" :selected="selection.imports" />
    
    <StepDone v-else-if="page === 'done'" @complete="complete" :loading="loading" />

  </OnboardingLayout>

  <TransitionPortal :show="isTransitioning" />
  
</template>
