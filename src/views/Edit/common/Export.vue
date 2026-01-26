<template>
  <Popup v-model:visible="export_menu!">
    <div class="w-full flex flex-col gap-4">

      <h2 class="text-start text-xl font-semibold drop-shadow-sm">
          Exporter la note : <span class="text-(--text-little)">{{ note.title }}</span>
      </h2>

      <div class="flex justify-between w-[80%] mx-4 items-center">
        <label>Format :</label>

        <select v-model="selected_ext" class="select">
          <option value="pdf">PDF</option>
          <option value="html">HTML</option>
          <option value="snote">SNOTE</option>
        </select>
      </div>

      <div class="flex justify-end gap-4">
        <button class="primary danger" @click="close">
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
import getHTMLWithNote from '@/assets/ts/utils/getHTMLWithNote';
import Popup from '@/components/popup/Popup.vue';
import { useUser } from '@clerk/vue';
import { ref } from 'vue'


const export_menu = defineModel<boolean>('visible')


const props = defineProps<{
  note: Note;
}>()

const { user } = useUser();
const selected_ext = ref<'pdf' | 'html' | 'snote'>('pdf')
const loading = ref<boolean>(false)


const exportNote = async () => {

    if (loading.value) return
    loading.value = true

    try {

        if (!user.value) return;
        const _user = {
            id: user.value.id,
            username: user.value.username
        }

        const html = getHTMLWithNote(props.note, _user);
        
        if (selected_ext.value === 'pdf')
        {
            await utils.downloadHtmlToPdf(html, props.note.title + '.pdf');
        }
        else if (selected_ext.value === 'html')
        {
            utils.downloadHtmlFile(html, props.note.title + '.html');
        }
        else if (selected_ext.value === 'snote')
        {
            await utils.downloadHtmlToSnote(props.note);
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
