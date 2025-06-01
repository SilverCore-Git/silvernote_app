<template>
  <div class="editor-container" @click="focusEditor">
    <editor-content :editor="editor ?? undefined" class="prose h-full" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { Extension } from '@tiptap/core'
import { evaluate } from 'mathjs'
import db from '../assets/ts/database'

const props = defineProps<{ id: number }>()

const editor = ref<Editor | undefined>();
const content = ref<string>('')

// Donne le focus à l'éditeur si non actif
const focusEditor = () => {
  if (editor.value && !editor.value.isFocused) {
    editor.value.commands.focus()
  }
}

// Charge le contenu de la note
const loadContent = async () => {
  try {
    const note = await db.getNote(props.id)
    content.value = note?.content || ''
    console.log(note)
  } catch (error) {
    console.error('Erreur lors du chargement de la note:', error)
    content.value = 'Erreur de chargement.'
  }
}

// Évalue les expressions mathématiques
function checkForMath() {
  if (!editor.value) return

  const regex = /(\d+(?:\s*[\+\-\*\/]\s*\d+)+)\s*=(?!\d)/g

  editor.value.state.doc.descendants((node, pos) => {
    if (!node.isText) return true

    const text = node.text ?? ''
    let match
    while ((match = regex.exec(text)) !== null) {
      const rawExpr = match[1].trim()
      const fullMatch = match[0]

      try {
        const result = evaluate(rawExpr)
        const evaluated = `${rawExpr}=${result}`

        if (text.includes(evaluated)) continue

        const from = pos + match.index
        const to = from + fullMatch.length

        editor.value?.commands.command(({ tr }) => {
          tr.insertText(evaluated, from, to)
          return true
        })
      } catch (e) {
        console.warn(`Échec de l’évaluation "${rawExpr}"`, e)
      }
    }
    return true
  })
}

// Sauvegarde du contenu dans la base
const saveContent = () => {
  if (editor.value) {
    db.saveContent(editor.value.getHTML(), props.id)
  }
}

// Raccourci clavier Ctrl/Cmd+Enter pour forcer l’évaluation
const MathEvalShortcut = Extension.create({
  name: 'mathEvalShortcut',
  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        checkForMath()
        return true
      },
    }
  },
})

// Initialisation
onMounted(async () => {

  setTimeout(async () => {

    await loadContent()

    editor.value = new Editor({
      extensions: [
        StarterKit,
        Link,
        Underline,
        Placeholder.configure({
          placeholder: 'Commencez à écrire ici...',
        }),
        MathEvalShortcut,
      ],
      content: content.value,
      onUpdate: () => {
        saveContent()
        checkForMath()
      },
    })

  }, 500);

})
 
// Nettoyage
onBeforeUnmount(() => {
  editor.value?.destroy()
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
