<template>
  <div class="editor-container">
    <editor-content :editor="editor" class="prose bg-white" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

// Initialisation de l'éditeur Tiptap avec StarterKit et l'extension Underline
const editor = new Editor({
  extensions: [
    StarterKit,
    Underline,
  ],
  content: ``,
})

// Nettoyage de l'éditeur lorsque le composant est détruit
onBeforeUnmount(() => {
  editor.destroy()
})

</script>



<style>

@import '../assets/css/basic.css';

.editor-container {
  width: 90%;
  min-height: 70vh;
}

/* Zone éditable de Tiptap */
.ProseMirror {
  border: none ;
  outline: none ;
  box-shadow: none ;
  padding: 1rem;
  font-family: system-ui, sans-serif;
  background-color: white;
}

.ProseMirror:focus {
  outline: 1px solid #3B3B3B;
}

</style>
