<template>
  <div class="editor-container" @click="focusEditor">
    <editor-content :editor="editor" class="prose h-full" />
  </div>
</template>

<script setup lang="ts">

import { onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'


const focusEditor = () => {
  if (!editor) return
  if (!editor.isFocused) {
    editor.commands.focus()
  }
}


// Initialisation de l'éditeur Tiptap avec StarterKit et l'extension Underline
const editor = new Editor({
  extensions: [
    StarterKit,
    Link,
    Underline,
    Placeholder.configure({
      placeholder: 'Commencez à écrire ici...',
    }),
  ],
  content: ''
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
  display: flex;
  flex-direction: column;
}

.editor-container .ProseMirror {

  height: 100%;
  overflow-y: hidden;
  border: none;
  outline: none;
  box-shadow: none;
  font-family: system-ui, sans-serif;
  background-color: #FFF8F0;
}

.ProseMirror p.is-empty::before {
  content: attr(data-placeholder);
  color: #aaa;
  float: left;
  height: 0;
  pointer-events: none;
}


</style>
