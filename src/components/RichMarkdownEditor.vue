<template>

  <div class="editor-container" @click="focusEditor">
    <editor-content :editor="editor ?? undefined" class="prose h-full" />
    <loader v-if="loader" class=" absolute inset-0 " :icon="false" />
  </div>

  <div v-if="!isLargeScreen" class="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)]">

    <div
      class="mx-2 mb-2 flex justify-between items-center gap-2 rounded-2xl bg-[var(--bg2)] text-[var(--text)] border border-[var(--btn)] px-4 py-2 shadow-lg backdrop-blur-sm"
    >

      <div class="flex gap-1">

        <button
          v-for="n in 4"
          :key="n"
          @click="toggleHeading(n)"
          class="px-2 py-1 rounded-md text-sm font-medium transition-colors hover:bg-[var(--text)] hover:text-[var(--bg2)] cursor-pointer"
        >H{{ n }}</button>

      </div>

      <div class="flex gap-1">

        <button 
          @click="toggleBold" 
          :class="[ 
            'px-2 py-1 rounded-md text-sm font-medium transition-colors border-2 border-transparent hover:bg-[var(--text)] hover:text-[var(--bg2)] cursor-pointer', 
            { 'bg-[var(--text)] text-[var(--bg2)] border-2 border-[var(--btn)];': isBoldActive } 
            ]"
          >
            <strong>B</strong>
        </button>

        <button 
          @click="toggleItalic" 
          :class="[ 
            'px-2 py-1 rounded-md text-sm font-medium transition-colors border-2 border-transparent hover:bg-[var(--text)] hover:text-[var(--bg2)] cursor-pointer', 
            { 'bg-[var(--text)] text-[var(--bg2)] border-2 border-[var(--btn)];': isItalicActive } 
            ]"
          >
            <em>i</em>
        </button>

        <button 
          @click="toggleStrike" 
          :class="[ 
            'px-2 py-1 rounded-md text-sm font-medium transition-colors border-2 border-transparent hover:bg-[var(--text)] hover:text-[var(--bg2)] cursor-pointer', 
            { 'bg-[var(--text)] text-[var(--bg2)] border-2 border-[var(--btn)];': isStrikeActive } 
            ]"
          >
            <s>S</s>
        </button>

        <button 
          @click="toggleUnderline" 
          :class="[ 
            'px-2 py-1 rounded-md text-sm font-medium transition-colors border-2 border-transparent hover:bg-[var(--text)] hover:text-[var(--bg2)] cursor-pointer', 
            { 'bg-[var(--text)] text-[var(--bg2)] border-2 border-[var(--btn)];': isUnderlineActive } 
            ]"
          >
            <u>U</u>
        </button>

      </div>

      <div>

        <button 
          @click="toggleCode" 
          :class="[ 
            'px-2 py-1 rounded-md text-sm font-medium transition-colors border-2 border-transparent hover:bg-[var(--text)] hover:text-[var(--bg2)] cursor-pointer', 
            { 'bg-[var(--text)] text-[var(--bg2)] border-2 border-[var(--btn)];': isCodeActive } 
            ]"
          >
            &lt;&gt;
          </button>

      </div>

    </div>

  </div>


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

import Loader from './Loader.vue'
import db from '../assets/ts/database'

const props = defineProps<{ id: number }>()

const isLargeScreen = ref<boolean>(window.innerWidth >= 1024);
const updateSize = () => {
    isLargeScreen.value = window.innerWidth >= 1024;
}
onMounted(() => {
    window.addEventListener('resize', updateSize);
})


const loader = ref<boolean>(true);
const editor = ref<Editor | undefined>();
const content = ref<string>('');


const toggleBold = () => editor.value?.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run();
const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run();
const toggleCode = () => editor.value?.chain().focus().toggleCode().run();
const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run();
const toggleHeading = (level: any) => editor.value?.chain().focus().toggleHeading({ level }).run();

// États des boutons (actifs ou non)
const isBoldActive = computed(() => editor.value?.isActive('bold') || false);
const isItalicActive = computed(() => editor.value?.isActive('italic') || false)
const isStrikeActive = computed(() => editor.value?.isActive('strike') || false)
const isUnderlineActive = computed(() => editor.value?.isActive('underline') || false)
const isCodeActive = computed(() => editor.value?.isActive('code') || false)

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

    loader.value = false;

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
