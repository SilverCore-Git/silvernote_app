<template>
  <Popup v-model:visible="import_menu!">
    <div class="flex flex-col gap-6">
      <h2 class="text-2xl font-bold">Importer du contenu</h2>

      <select v-model="selected_import_type" class="select">
        <option value="notion">Notion</option>
        <option value="snote">SilverNote</option>
      </select>

      <button class="primary">
        <label class="cursor-pointer">
          Importer un fichier
          <span class="uppercase"> .{{ fileExtension }}</span>

          <input
            type="file"
            class="hidden"
            :accept="acceptType"
            @change="onImportFile"
          />
        </label>
      </button>

      <div class="flex justify-end gap-4">
        <button class="primary danger" @click="close">
          Annuler
        </button>

        <button
          class="primary"
          :disabled="!import_file"
          @click="importFile"
        >
          Confirmer
        </button>
      </div>
    </div>
  </Popup>
</template>

<script setup lang="ts">
import Popup from '@/components/popup/Popup.vue'
import { ref, computed } from 'vue'

/* v-model */
const import_menu = defineModel<boolean>('visible')

/* State */
const selected_import_type = ref<'notion' | 'snote'>('notion')
const import_file = ref<File | null>(null)

/* Computed */
const acceptType = computed(() =>
  selected_import_type.value === 'notion'
    ? 'text/html'
    : '.snote'
)

const fileExtension = computed(() =>
  selected_import_type.value === 'notion'
    ? 'html'
    : 'snote'
)

/* Methods */
const onImportFile = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  import_file.value = files?.[0] ?? null
}

const importFile = () => {
  if (!import_file.value) return

  // 👉 logique d’import ici
  console.log('Import :', selected_import_type.value, import_file.value)

  close()
}

const close = () => {
  import_menu.value = false
  import_file.value = null
}
</script>
