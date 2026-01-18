<template>
  <Popup v-model:visible="export_menu!">
    <div class="w-full flex flex-col gap-4">
      <h2 class="text-xl font-bold">
        Exporter :
        <span class="font-medium">{{ note.title }}</span>
      </h2>

      <div class="flex justify-between w-[80%] mx-4 items-center">
        <label>Format :</label>

        <select v-model="selected_ext" class="select">
          <option value="pdf">PDF</option>
          <option value="html">HTML</option>
          <option value="snote">SilverNote</option>
        </select>
      </div>

      <div class="flex justify-end gap-4">
        <button class="second" @click="close">
          Annuler
        </button>

        <button
          class="primary"
          :disabled="loading"
          :class="{ loader: loading }"
          @click="exportNote"
        >
          Confirmer
        </button>
      </div>
    </div>
  </Popup>
</template>

<script setup lang="ts">
import type { Note } from '@/assets/ts/type';
import utils from '@/assets/ts/utils';
import Popup from '@/components/popup/Popup.vue';
import { ref } from 'vue'


const export_menu = defineModel<boolean>('visible')


const props = defineProps<{
  note: Note;
}>()


const selected_ext = ref<'pdf' | 'html' | 'snote'>('pdf')
const loading = ref<boolean>(false)


const exportNote = async () => {

    if (loading.value) return
    loading.value = true

    try {
        
        if (selected_ext.value === 'pdf')
        {
            utils.downloadHtmlToPdf(props.note.title, props.note.content);
        }
        else if (selected_ext.value === 'html')
        {
            utils.downloadHtmlFile(props.note.title, props.note.content);
        }
        else if (selected_ext.value === 'snote')
        {
            utils.downloadHtmlToSnote(props.note);
        }

    } finally {
        loading.value = false
        close()
    }

}

const close = () => {
  export_menu.value = false
}
</script>
