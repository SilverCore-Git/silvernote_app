<template>

    <Teleport to="body">

        <div
            v-for="(err, index) in errors"
            :key="err.timestamp.getTime()"
        >
            
            <div
                v-if="err.show && !err.little"
                class="fixed inset-0 z-1000 flex items-center justify-center bg-black/50"
            >

                <div class="w-full max-w-md rounded-xl bg-(--bg2) p-6 shadow-xl">

                    
                    <div class="mb-4 flex items-center justify-between">
                        
                            <div>
                                <h2 class="text-lg font-semibold text-red-600">
                                    Une erreur est survenue
                                </h2>
                                <p class="text-xs text-gray-400">
                                    {{ err.timestamp.toLocaleString() }}
                                </p>
                            </div>

                            <button
                                class="cursor-pointer text-gray-400 hover:text-gray-600"
                                @click="close(index)"
                            >
                                <i class="bi bi-x text-4xl"></i>
                            </button>

                        </div>

                        <p class="mb-2 text-gray-800 p-2 bg-gray-400/20 border-gray-400 border rounded-xl">
                            {{ err.message ?? getDefaultMessage(err.error) }}
                        </p>

                        <p
                            v-if="err.more"
                            class="mb-4 text-sm text-gray-500"
                        >
                            {{ err.more }}
                        </p>

                        <div
                            v-if="err.error"
                            class="mb-4 text-xs text-gray-400"
                        >
                            Code erreur : {{ err.error.toUpperCase() }}
                        </div>

                        <div class="flex justify-between items-center">

                            <span class="text-xs text-gray-400">
                                Erreur {{ index + 1 }} / {{ errors.length }}
                            </span>

                            <button
                                class="primary danger"
                                @click="close(index)"
                            >
                                Fermer
                            </button>

                        </div>

                </div>

            </div>

            
            <div
                v-if="errors.some(e => e.little)"
                class="fixed left-6 bottom-6 z-1000"
                @click="restoreAll"
            >
                <button class="primary danger">
                    Voir les erreurs ({{ errors.length }})
                </button>
            </div>
        
        </div>

    </Teleport>
    
</template>


<script lang="ts" setup>
import { errors, closeError } from "./postError";

const getDefaultMessage = (code?: string) => {
  switch (code) {
    case "400":
      return "La requête est invalide.";
    case "500":
      return "Erreur interne du serveur.";
    default:
      return "Une erreur inconnue est survenue.";
  }
};

const close = (index: number) => {
  closeError(index);
};

const restoreAll = () => {
  errors.value.forEach(err => (err.little = false));
};
</script>
