<template>


    <transition name="fade-slide">
      
      <div
        v-if="visible"
      >

        <div 
          class="dropdown absolute right-0 top-14"
        >

          <ul>

            <li @click="tagManager = true">Gérer les tags</li>
            <!-- <li v-if="editor" @click="showSearchBar">Rechercher</li> -->

            <hr />

            <li v-if="editor" @click="()=> editor?.chain().focus().undo().run()">Annuler</li>
            <li v-if="editor" @click="()=> editor?.chain().focus().redo().run()">Rétablir</li>

            <hr />

            <li @click="export_menu = true">Exporter</li>
            <li @click="import_menu = true">Importer</li>

            <hr />

            <li @click="share_menu = true">Partager</li>
            <li @click="saveNote(Number(props.id))">Sauvegarder</li>

            <hr />

            <li class="text-red-600" @click="delete_note(1)">Supprimer</li>

            <hr />

            <li
              class="flex flex-col"
            >

              <div
                class="flex flex-col text-[12px]
                       justify-start items-start"
              >

                <span>
                  Nombres de mots : 
                  {{ isLoaded ? stats?.getWordCount() : '...' }}
                </span>

                <span>
                  Nombres de caractere : 
                  {{ isLoaded ? stats?.getCharacterCount() : '...' }}
                </span>

              </div>

            </li>

          </ul>

        </div>

      </div>
    
    </transition>

  <share_menu
    :uuid="note.uuid"
    :title="note.title"
    v-model="share_menu"
  />

  <ConfirmDialog
    :visible="showDialog"
    title="Confirmation"
    message="Voulez-vous vraiment supprimer cette note ?"
    @confirm="delete_note(2)"
    @cancel="showDialog = false"
  />

  <Tags_manager
    v-if="note"
    v-model:active="tagManager"
    :tags="note.tags.map((tag: any) => Number(tag))"
    :loader="onUpdateTags"
    @update:tags="onTagsUpdate"
  />

  <Popup v-model:visible="export_menu">

    <div class="w-full h-full flex justify-start items-start flex-col gap-2">

      <h2 class="text-xl font-bold mb-4">
        Exporter la note : <span class="font-medium">{{ note.title }}</span>
      </h2>

      <div class="flex flex-row justify-between  w-[80%] mx-4">

        <label class="text-base" for="">Exporter en :</label>
        <select 
          v-model="selected_ext"
          class="px-2.5 pt-1.5 pb-2 rounded-lg border border-gray-300 bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-[var(--btn)] transition-all duration-200"
        >
          <option value="pdf">pdf</option>
          <option value="html">html</option>
          <option value="snote">snote</option>
        </select>

      </div>

      <div class="flex flex-row w-full justify-end gap-4 mt-4">

        <button
          class="second"
          @click="export_menu = false"
        >
          Annuler
        </button>

        <button
          class="primary"
          :class="export_loading ? 'loader' : ''"
          @click="export_note(selected_ext)"
        >
          Confirmer
        </button>

      </div>

    </div>

  </Popup>

  <Popup v-model:visible="import_menu">

    <div class="w-full max-w-md flex flex-col gap-6">

      <div class="flex flex-col gap-2">
        <h2 class="text-2xl font-bold">Importer du contenu</h2>
        <p class="text-gray-600 text-sm">Cette fonctionnalité remplace la note actuelle.</p>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-base font-medium" for="import-type">Importer depuis :</label>
        <select
          id="import-type"
          v-model="selected_import_type"
          class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-[var(--btn)] transition-all duration-200"
        >
          <option value="notion">Notion</option>
          <option value="snote">Silvernote</option>
        </select>
      </div>

      <button class="primary cursor-pointer">
        <label>
          <h3>
            Importer un fichier 
            <span class=" uppercase">
              .{{
                selected_import_type == 'notion' 
                  ? 'HTML' 
                  :  selected_import_type
              }}
            </span>
          </h3>
          <input
            type="file"
            :accept="selected_import_type == 'notion' ? 'text/html' : `.${selected_import_type}`"
            class="hidden"
            @change="import_file = $event"
          />
        </label>
      </button>

      <div class="flex justify-end gap-4 mt-4">
        <button
          class="primary danger"
          @click="import_menu = false"
          :class="export_loading ? 'loader' : ''"
        >
          Annuler
        </button>

        <button
          class="primary"
          :class="export_loading ? 'loader' : ''"
          @click="importFile()"
        >
          Confirmer
        </button>
      </div>

    </div>
  </Popup>


</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { stats, isLoaded } from '@/components/Markdown/Function/Stats';
import { editor } from '@/components/Markdown/Editor';

defineProps<{
  visible: boolean,
}>();

const emit = defineEmits(['update:visible']);

const tagManager = ref<boolean>(false);
const export_menu = ref<boolean>(false);
const import_menu = ref<boolean>(false);
const share_menu = ref<boolean>(false);

</script>