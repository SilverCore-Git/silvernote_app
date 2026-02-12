<template>
  <Popup v-model:visible="import_menu!">
    <div class="flex flex-col gap-6">

      <div>
        <h2 class="text-2xl font-bold">Importer du contenu</h2>
        <span class="text-red-400">Attention, cela vas remplacer votre note !</span>
      </div>

      <select v-model="selected_import_type" class="select">
        <option value="notion">Notion (.HTML)</option>
        <option value="snote">Silvernote (.SNOTE)</option>
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
          :class="loaded ? 'loader' : ''"
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
import getArrayFromNotionHTML from '@/assets/ts/utils/getArrayFromNotionHTML'
import { Notes } from '@/assets/ts/database/Var';
import database from '@/assets/ts/database/database';
import type { Note } from '@/assets/ts/type';
import { editor } from '@/components/Markdown/Editor';
import { updateIcon, updateTitle } from '@/views/Edit/composable/useTitleIcon';

const props = defineProps<{
  uuid: string;
}>();

const import_menu = defineModel<boolean>('visible')

const selected_import_type = ref<'notion' | 'snote'>('snote')
const import_file = ref<File | null>(null)
const loaded = ref<boolean>(false);

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


const onImportFile = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  import_file.value = files?.[0] ?? null
}

const importFile = async () => {

  if (!import_file.value) return

  loaded.value = true;

  try {

    if (selected_import_type.value === 'notion')
    {
      const notion_note = getArrayFromNotionHTML(await import_file.value.text())
      const note: Note | undefined = Notes.value.find(_note => _note.uuid === props.uuid)
      if (note)
      {
        note.title = notion_note.title;
        note.content = notion_note.content;
        note.icon = notion_note.icon;
        await database.update(note);

        editor.value?.commands.setContent(note.content);
        updateTitle(note.title);
        updateIcon(note.icon);
        
      }
      else
      {
        throw new Error('Note is not defined...');
      }
    }
    else if (selected_import_type.value === 'snote')
    {
      const snote_note = JSON.parse(await import_file.value.text());
      const note: Note | undefined = Notes.value.find(_note => _note.uuid === props.uuid)
      if (note)
      {

        note.title = snote_note.note.title;
        note.content = snote_note.note.content;
        note.icon = snote_note.note.icon;
        await database.update(note);

        editor.value?.commands.setContent(note.content);
        updateTitle(note.title);
        updateIcon(note.icon);

      }
      else
      {
        throw new Error('Note is not defined...');
      }
    }

  }
  catch (err) {
    throw new Error(`An error occured while importing file : ${err}`);
  }
  finally {
    loaded.value = false;
    close();
  }

}

const close = () => {
  import_menu.value = false
  import_file.value = null
}

</script>
