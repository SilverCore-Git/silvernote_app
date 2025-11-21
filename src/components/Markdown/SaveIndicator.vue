<template>
  <div class="fixed top-8 lg:top-4 left-(--mrl) translate-x-15 z-1000">
    <transition name="fade">
      <div 
        v-if="status !== 'idle'" 
        class="flex items-center gap-2 px-2 py-1 rounded-lg text-sm font-medium shadow-lg backdrop-blur"
        :class="statusClass"
      >
        <i class="text-base bi" :class="statusIcon" />
        <span>{{ statusText }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const status = ref<SaveStatus>('idle');
const lastSaveTime = ref<number>(0);

const statusClass = computed(() => {
  switch (status.value) {
    case 'saving': return 'bg-blue-500/90 text-white';
    case 'saved': return 'bg-green-500/90 text-white';
    case 'error': return 'bg-red-500/90 text-white';
    default: return '';
  }
});


const statusIcon = computed(() => {
  switch (status.value) {
    case 'saving': return 'bi-hourglass-split';
    case 'saved': return 'bi-check-lg';
    case 'error': return 'bi-exclamation-triangle-fill';
    default: return '';
  }
});


const statusText = computed(() => {
  switch (status.value) {
    case 'saving': return 'Enregistrement...';
    case 'saved': return 'Enregistré';
    case 'error': return 'Erreur de sauvegarde';
    default: return '';
  }
});

const handleNoteSaved = (event: Event) => {
  const customEvent = event as CustomEvent<{ noteId: number; timestamp: number }>;
  console.log('Note saved:', customEvent.detail);
  
  status.value = 'saved';
  lastSaveTime.value = customEvent.detail.timestamp;
  
  setTimeout(() => {
    if (status.value === 'saved') status.value = 'idle';
  }, 2000);
};

const handleSaveError = (event: Event) => {
  const customEvent = event as CustomEvent<{ noteId: number; error: any }>;
  console.error('Save error:', customEvent.detail);
  
  status.value = 'error';
  
  setTimeout(() => {
    if (status.value === 'error') status.value = 'idle';
  }, 5000);
};

const handleEditorUpdate = () => {
  if (status.value === 'idle') status.value = 'saving';
};

onMounted(() => {
  window.addEventListener('note-saved', handleNoteSaved);
  window.addEventListener('note-saving', handleEditorUpdate);
  window.addEventListener('note-save-error', handleSaveError);
});

onBeforeUnmount(() => {
  window.removeEventListener('note-saved', handleNoteSaved);
  window.removeEventListener('note-saving', handleEditorUpdate);
  window.removeEventListener('note-save-error', handleSaveError);
});

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
