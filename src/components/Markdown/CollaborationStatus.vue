<script setup lang="ts">
import type { Collaborator } from './EditorProvider';

defineProps<{
  collaborators: Collaborator[];
  show: boolean;
}>();

const emit = defineEmits(['update:show']);

// Vérifier si un collaborateur est en train d'écrire
function isTyping(collaborator: Collaborator): boolean {
  // Vérifier si le collaborateur a un curseur actif
  return collaborator.cursor !== null && collaborator.cursor !== undefined;
}

// Formater le nom pour l'affichage
function formatName(name: string, id: number): string {
  if (name && name.trim() !== '') {
    return name.length > 15 ? name.substring(0, 15) + '...' : name;
  }
  return `Anonyme ${id % 1000}`;
}

// Fermer le panneau
function close() {
  emit('update:show', false);
}
</script>

<template>
  <!-- Panneau des collaborateurs -->
  <transition name="slide-up">
    <div
      v-if="show && collaborators.length > 0"
      class="collaboration-status fixed bottom-6 right-6 bg-(--bg2) p-4 rounded-xl shadow-2xl border border-(--white)/10 z-50"
    >
      <!-- En-tête -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-(--text)">Collaborateurs</h3>
        <button
          @click="close"
          class="text-(--text-little) hover:text-(--text) transition-colors p-1 rounded-lg hover:bg-(--bg)/50"
          title="Fermer"
        >
          <i class="bi bi-x-lg text-lg" />
        </button>
      </div>

      <!-- Liste des collaborateurs -->
      <div class="space-y-3 max-w-xs">
        <div
          v-for="collaborator in collaborators"
          :key="collaborator.id"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-(--bg)/50 transition-all duration-200 cursor-default"
          :title="collaborator.name"
        >
          <!-- Indicateur de couleur -->
          <div
            class="w-3 h-3 rounded-full flex-shrink-0"
            :style="{ backgroundColor: collaborator.color }"
            :title="collaborator.color"
          />

          <!-- Informations du collaborateur -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-(--text)">
              {{ formatName(collaborator.name, collaborator.id) }}
            </div>
            <div class="text-xs opacity-50">
              {{ isTyping(collaborator) ? 'est en train d\'écrire' : 'en ligne' }}
            </div>
          </div>

          <!-- Indicateur d'activité -->
          <div
            v-if="isTyping(collaborator)"
            class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            title="En train d'écrire"
          />
          <div
            v-else
            class="w-2 h-2 bg-(--text-little)/30 rounded-full"
            title="En ligne"
          />
        </div>
      </div>

      <!-- Pied -->
      <div class="mt-3 pt-3 border-t border-(--white)/5 text-xs opacity-40">
        {{ collaborators.length }} collaborateur{{ collaborators.length > 1 ? 's' : '' }}
      </div>
    </div>
  </transition>

  <!-- Indicateur compact (quand le panneau est fermé) -->
  <transition name="fade">
    <div
      v-if="!show && collaborators.length > 0"
      @click="emit('update:show', true)"
      class="collaboration-indicator fixed bottom-6 right-6 bg-(--btn) p-3 rounded-full shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all z-50"
      title="Voir les collaborateurs"
    >
      <i class="bi bi-people-fill text-white text-xl" />
      <span class="absolute -top-1 -right-1 bg-white text-(--btn) text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {{ collaborators.length }}
      </span>
    </div>
  </transition>
</template>

<style scoped>
.collaboration-status {
  max-width: 280px;
  animation: slideUp 0.3s ease-out;
}

.collaboration-indicator {
  width: 48px;
  height: 48px;
}

.collaboration-indicator span {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
