<template>

  <div
    class="
      fixed 
      z-50 pointer-events-none
      left-19 md:left-[16%] xl:left-[26%]
        2xl:left-[30vw]
    "
    :class="isElectron ? 'top-14' : 'top-4'"
  >

    <transition name="slide-fade">

      <div 
        v-if="status !== 'idle'" 
        class="
          flex items-center gap-2
          px-3 py-1.5 rounded-full
          text-xs font-semibold shadow-sm
          border border-white/5
          backdrop-blur-md
        "
        :class="statusStyles"
      >

        <i
          class="bi text-sm" 
          :class="[
            statusIcon,
            { 'animate-spin': status === 'saving' }
          ]"
        />

        <span 
          class="tracking-wide uppercase"
        >
          {{ statusText }}
        </span>

      </div>

    </transition>

  </div>

</template>

<script setup lang="ts">

import isElectron from '@/assets/ts/utils/isElectron';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline' | 'online';

let isOffline = false;
const status = ref<SaveStatus>('idle');
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const statusStyles = computed(() => {
  switch (status.value) {
    case 'saving': return 'bg-white/10 text-(--text-little)';
    case 'saved':  return 'bg-green-500/20 text-green-400 border-green-500/20';
    case 'error':  return 'bg-red-500/20 text-red-400 border-red-500/20';
    case 'offline':  return 'bg-red-500/20 text-red-400 border-red-500/20';
    case 'online':  return 'bg-green-500/20 text-green-400 border-green-500/20';
    default: return '';
  }
});

const statusIcon = computed(() => {
  switch (status.value) {
    case 'saving': return 'bi-arrow-repeat';
    case 'saved':  return 'bi-check2';
    case 'error':  return 'bi-cloud-slash';
    case 'offline':  return 'bi-cloud-slash';
    case 'online':  return 'bi-cloud-check';
    default: return '';
  }
});

const statusText = computed(() => {
  switch (status.value) {
    case 'saving': return 'Sync...';
    case 'saved':  return 'À jour';
    case 'error':  return 'Erreur';
    case 'offline':  return 'Hors-ligne';
    case 'online':  return 'En-ligne';
    default: return '';
  }
});

// Gestionnaire de nettoyage du status
const setStatusWithTimeout = (newStatus: SaveStatus, delay: number) => {
  if (timeoutId) clearTimeout(timeoutId);
  status.value = newStatus;
  timeoutId = setTimeout(() => {
    status.value = 'idle';
  }, delay);
};

const handleNoteSaved = () => {
  if (isOffline) return status.value = 'offline';
  setStatusWithTimeout('saved', 2000);
};

const handleSaveError = () => {
  if (isOffline) return status.value = 'offline';
  setStatusWithTimeout('error', 5000);
};

const handleSaveOffline = () => {
  isOffline = true;
  status.value = 'offline';
};

const handleSaveOnline = () => {
  isOffline = false;
  setStatusWithTimeout('online', 3000);
};

const handleEditorUpdate = () => {
  if (isOffline) return status.value = 'offline';
  if (status.value !== 'saving') status.value = 'saving';
};

onMounted(() => {
  window.addEventListener('note-saved', handleNoteSaved);
  window.addEventListener('note-saving', handleEditorUpdate);
  window.addEventListener('note-save-error', handleSaveError);
  window.addEventListener('note-save-offline', handleSaveOffline);
  window.addEventListener('note-save-online', handleSaveOnline);
});

onBeforeUnmount(() => {
  window.removeEventListener('note-saved', handleNoteSaved);
  window.removeEventListener('note-saving', handleEditorUpdate);
  window.removeEventListener('note-save-error', handleSaveError);
  window.removeEventListener('note-save-offline', handleSaveOffline);
  window.removeEventListener('note-save-online', handleSaveOnline);
});

</script>

<style scoped>

.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.9);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(1);
  filter: blur(4px);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

</style>