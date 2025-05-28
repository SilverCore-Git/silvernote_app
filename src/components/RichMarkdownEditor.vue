<template>
  <div class="editor-container" @click="focusEditor">
    <editor-content :editor="editor" class="prose h-full" />
  </div>
</template>

<script setup lang="ts">

import { onBeforeUnmount } from 'vue'

import { evaluate } from 'mathjs';

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'

const props = defineProps<{
  content: string
}>();

const focusEditor = () => {
  if (!editor) return
  if (!editor.isFocused) {
    editor.commands.focus()
  }
}


const editor = new Editor({
  extensions: [
    StarterKit,
    Link,
    Underline,
    Placeholder.configure({
      placeholder: 'Commencez à écrire ici...',
    }),
  ],
  content: props.content,
  onUpdate: () => {
    checkForMath();
  },
});


// Nettoyage de l'éditeur lorsque le composant est détruit
onBeforeUnmount(() => {
  editor.destroy()
})
  

function checkForMath() {
  if (!editor) return;

  const regex = /(\d+[+\-*/\d\s().]*?)=(?!\d)/g;

  editor.state.doc.descendants((node, pos) => {
    if (!node.isText) return true;

    const text = node.text || '';
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const rawExpr = match[1].trim();
      const fullMatch = match[0];

      try {
        const result = evaluate(rawExpr);
        const fullExpr = `${rawExpr}=${result}`;

        // Ne rien faire si déjà remplacé
        if (text.includes(fullExpr)) continue;

        const from = pos + match.index;
        const to = from + fullMatch.length;

        // Appliquer la transformation
        editor.commands.command(({ tr }) => {
          tr.insertText(fullExpr, from, to);
          return true;
        });

      } catch (e) {
        // Ignorer les erreurs de calcul
      }
    }

    return true;
  });
}


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
