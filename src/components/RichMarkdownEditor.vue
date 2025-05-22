<template>
  <div class="editor-container">
    <!-- Toolbar (boutons d'édition) -->
    <div class="toolbar flex gap-2 mb-4">
      <button @click="toggle('heading', { level: 1 })" :class="{ active: isActive('heading', { level: 1 }) }">H1</button>
      <button @click="toggle('heading', { level: 2 })" :class="{ active: isActive('heading', { level: 2 }) }">H2</button>
      <button @click="toggle('bold')" :class="{ active: isActive('bold') }">Gras</button>
      <button @click="toggle('italic')" :class="{ active: isActive('italic') }">Italique</button>
      <button @click="toggle('underline')" :class="{ active: isActive('underline') }">Souligné</button>
      <button @click="toggle('bulletList')" :class="{ active: isActive('bulletList') }">Liste •</button>
      <button @click="toggle('orderedList')" :class="{ active: isActive('orderedList') }">Liste 1.</button>
      <button @click="toggle('blockquote')" :class="{ active: isActive('blockquote') }">Citation</button>
      <button @click="toggle('codeBlock')" :class="{ active: isActive('codeBlock') }">Code</button>
    </div>

    <!-- Contenu de l'éditeur -->
    <editor-content :editor="editor" class="prose bg-white p-4 rounded border min-h-[200px]" />
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

// Fonction pour basculer un style
const toggle = (type: string, options = {}) => {
  editor.chain().focus().toggleMark?.(type).run?.() ||
  editor.chain().focus().toggleNode?.(type, type, options).run?.() ||
  editor.chain().focus()[`toggle${capitalize(type)}`]?.(options).run?.()
}

// Fonction pour vérifier si un style est actif
const isActive = (type: string, options = {}) => {
  return editor.isActive(type, options)
}

// Fonction utilitaire pour capitaliser les noms des styles
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Nettoyage de l'éditeur lorsque le composant est détruit
onBeforeUnmount(() => {
  editor.destroy()
})

</script>

<style scoped>

@import '../assets/css/basic.css';


.editor-container {
  max-width: 800px;
  margin: auto;
}
.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
button.active {
  background-color: #D96E30;
  color: white;
  font-weight: bold;
}
button:hover {
  background-color: #e5e5e5;
}
.prose {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}
</style>
