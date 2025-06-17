<template>

  <div class="editor-container" @click="focusEditor">
    <editor-content :editor="editor ?? undefined" class="prose h-full" />
  </div>

  <div class="fixed w-full z-50" style="bottom: env(safe-area-inset-bottom);">

    <div 
      class="
              absolute left-2 right-2 bottom-0
              flex flex-row gap-1 justify-between items-center 
              bg-[#FFF8F0] border-t-1 border-[var(--text)] 
            "
    >

      <ul>
        <button @click="toggleHeading(1)">H1</button>
        <button @click="toggleHeading(2)">H2</button>
        <button @click="toggleHeading(3)">H3</button>
        <button @click="toggleHeading(4)">H4</button>
      </ul>

      <ul class="gap-1 flex flex-row">
        <li><button @click="if_open_color = !if_open_color" class="color-svg"></button></li>
        <li><button @click="handleCopyPaste" class="copy-svg"></button></li>
      </ul>

      <ul>
        <button @click="toggleBold" :class="{ active: isBoldActive }"><strong>B</strong></button>
        <button @click="toggleItalic" :class="{ active: isItalicActive }"><i>i</i></button>
        <button @click="toggleStrike" :class="{ active: isStrikeActive }"><s>S</s></button>
        <button @click="toggleUnderline" :class="{ active: isUnderlineActive }"><u>U</u></button>
      </ul>

    </div>

  </div>

  <transition>

    <section 
      v-if="if_open_color"
      class="absolute boottom-0 "
    >

      <div>

      </div>

    </section>

  </transition>

</template>

<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
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
const content = ref<string>('');
const text = ref<string>('');
const if_open_color = ref<boolean>(true);

const handleCopyPaste = async () => {

  try {

    const selection = editor.value?.state.doc.textBetween(
      editor.value.state.selection.from,
      editor.value.state.selection.to,
      ' '
    ) || ''


    if (selection) {

      await navigator.clipboard.writeText(selection)
      console.log('Texte sélectionné copié:', selection)
    } else {

      const fromClipboard = await navigator.clipboard.readText()
      await editor.value?.chain().focus().insertContent(fromClipboard).run()
      text.value = fromClipboard
      console.log('Texte collé:', fromClipboard)
      text.value = '';

    }

  } catch (error) {
    console.error('Erreur lors du copier/coller', error)
  };

};


const toggleBold = () => editor.value?.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run();
const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run();
const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run();
const toggleHeading = (level: 1 | 2 | 3 | 4) => editor.value?.chain().focus().toggleHeading({ level }).run();

// États des boutons (actifs ou non)
const isBoldActive = computed(() => editor.value?.isActive('bold') || false);
const isItalicActive = computed(() => editor.value?.isActive('italic') || false)
const isStrikeActive = computed(() => editor.value?.isActive('strike') || false)
const isUnderlineActive = computed(() => editor.value?.isActive('underline') || false)

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
        Link.configure({
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
        }),
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
}

.ProseMirror p.is-empty::before {
  content: attr(data-placeholder);
  color: #aaa;
  float: left;
  height: 0;
  pointer-events: none;
}

button {
  padding: 4px 8px;
  border: 1px solid transparent;
  cursor: pointer;
  color: black;
}
button.active {
  border: 1px solid #F28C28;
}

.copy-svg {
  width: 28px;
  height: 28px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  background-image: url('/assets/svgs/copy.svg');
}

.color-svg {
  width: 23px;
  height: 23px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  background-image: url('../assets/svgs/color.svg');
}


</style>
