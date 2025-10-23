<template>

  <ToolsMenu
      class="editor-container" 
      @click="focusEditor"
  >

    <div class="overflow-hidden">
      <EditorContent
        v-if="editor && !loader"
        :editor="editor as Editor"
        class="prose"
      />
      <div v-else class="animate-pulse bg-gray-300 h-80 w-full rounded-xl"></div>
    </div>

  </ToolsMenu>

  <SearchBar
    v-model:visible="_searchBar"
  />

</template>

<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';
import { CharacterCount, UndoRedo } from '@tiptap/extensions';
import Youtube from '@tiptap/extension-youtube';
import { Extension, InputRule } from '@tiptap/core';
import SlashCommand from '@/components/Markdown/tiptap-extensions/SlachCommand.js';
import { IndentExtension } from './tiptap-extensions/IndentExtension.js';
import FileHandler from '@tiptap/extension-file-handler';
//import { CollapsibleExtension } from './tiptap-extensions/CollapsibleExtension.js';
import DragHandle from './tiptap-extensions/dragHandle';
import './css/DragHandler.scss';
import { _searchBar, SearchBar, SearchAndReplace } from './tiptap-extensions/searchAndReplace';
import FileHandler_configure from './tiptap-extensions/FileHandler_configure.js';
import { Markdown } from 'tiptap-markdown';

import * as Y from 'yjs';
import { SocketIOProvider } from './SocketIOProvider.js';
import { Collaboration } from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';

import { useUser } from '@clerk/vue';
import { evaluate } from 'mathjs';
import type { Note } from '@/assets/ts/type';
import { api_url } from '@/assets/ts/backend_link';
import { getDominantColor } from '@/assets/ts/GetColorByImage';
import db from '@/assets/ts/database/database';
import ToolsMenu from '@/components/Markdown/ToolsMenu/ToolsMenu.vue';

import { editor, isLoaded } from './Editor';

const props = defineProps<{
  id: number
  editable?: boolean
  data: Note
  uuid: string
}>()

const isLargeScreen = ref<boolean>(window.innerWidth >= 1024);
const loader = ref<boolean>(true);
const { user } = useUser();

let provider: SocketIOProvider | null = null;
let autosaveInterval: ReturnType<typeof setInterval> | null = null;

const focusEditor = () => editor.value?.commands.focus();

function checkForMath() {
  if (!editor.value) return;
  const regex = /(\d+(?:\s*[\+\-\*\/]\s*\d+)+)\s*=(?!\d)/g;
  const state = editor.value.state;
  let tr = state.tr;

  state.doc.descendants((node, pos) => {
    if (!node.isText) return true;
    const text = node.text ?? '';
    let match;
    while ((match = regex.exec(text)) !== null) {
      const rawExpr = match[1].trim();
      const fullMatch = match[0];
      try {
        const result = evaluate(rawExpr);
        const evaluated = `${rawExpr}=${result}`;
        if (text.includes(evaluated)) continue;
        const from = pos + match.index;
        const to = from + fullMatch.length;
        tr = tr.insertText(evaluated, from, to);
      } catch (e) {
        console.warn(`Failed to evaluate "${rawExpr}"`, e);
      }
    }
    return true;
  });

  if (tr.docChanged) {
    editor.value.view.dispatch(tr as any);
  }
}


const TodoInput = TaskItem.extend({
  addInputRules() {
    return [
      new InputRule({
        find: /^\s*(\[[\sXx]\])\s*$/,
        handler: ({ state, range }) => {
          const { tr } = state;
          tr.deleteRange(range.from, range.to);
          editor.value?.chain().toggleTaskList().run();
        }
      })
    ]
  }
})


const saveNote = async () => {

  const newContent = editor.value?.getHTML();
  const note = await db.getNote(props.data.id);

  if (newContent && note) 
  {

    const newNote: Note = { ...note, content: newContent };
    await db.saveContent(newContent, props.data.id);
    await fetch(`${api_url}/api/db/update/a/note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ note: newNote })
    });

  }

};

const startAutoSave = () => {
  autosaveInterval = setInterval(saveNote, 10000);
};


const initEditor = async () => {
  
  const ydoc = new Y.Doc();
  provider = new SocketIOProvider(
    api_url == 'http://localhost:3000'
      ? 'http://localhost:3434'
      : api_url,
    props.data.uuid, 
    user.value?.id || "",
    ydoc,
    (command, content) => {
      if (command === 'insertContent' && editor.value) {
        editor.value.commands.setContent(content);
      }
    }
  );

  const color = await getColorByImage();

  editor.value = new Editor({
    extensions: [
      StarterKit.configure({ 
        history: false,
        blockquote: false
      }),
      TaskList,
      TodoInput,
      SlashCommand,
      SearchAndReplace,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Youtube.configure({ HTMLAttributes: { class: 'ytb-viewer' } }),
      UndoRedo,
      CharacterCount,
      TableKit,
      IndentExtension,
      Markdown.configure({ html: true }),
      Placeholder.configure({ placeholder: 'Commencez à écrire ici...' }),
      FileHandler.configure(FileHandler_configure),
      Collaboration.configure({ 
        document: ydoc,
        field: 'prosemirror'
      }),
      CollaborationCaret.configure({
        provider,
        user: { 
          name: user.value?.username || 'Invité',
          color,
          avatar: user.value?.imageUrl
        }
      }),
      Extension.create({
        name: 'mathEvalShortcut',
        addKeyboardShortcuts() {
          return { 'Mod-Enter': () => { checkForMath(); return true } }
        }
      })
    ].concat(DragHandle),
    editable: props.editable,
    onUpdate: () => { checkForMath(); }
  });

  await nextTick();

  isLoaded.value = true;
  loader.value = false;

  await nextTick();

  editor.value?.commands.setContent(props.data.content);

};


const getColorByImage = async (): Promise<string> => {
  if (!user.value?.id) return '#000000';
  try {
    const res = await fetch(`${api_url}/api/user/by/id/${user.value.id}`, { credentials: 'include' });
    const data = await res.json();
    return data.imageUrl ? getDominantColor(data.imageUrl) : '#000000';
  } catch (error) {
    console.error('Error fetching user image:', error);
    return '#000000';
  }
};

const updateSize = () => { isLargeScreen.value = window.innerWidth >= 1024; };


onMounted(() => {
  window.addEventListener('resize', updateSize);
  initEditor();
  startAutoSave();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize);
  if (editor.value) editor.value.destroy();
  if (provider) provider.destroy();
  if (autosaveInterval) clearInterval(autosaveInterval);
  saveNote();
});

</script>


<style>

@import './css/basic.css';
@import './css/Table.css';
@import './css/ToDoList.css';
@import './css/tiptap_carets.css';
@import './tiptap-extensions/dragHandle/drag-icon.css';

.editor-container {
  width: 100%;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-container .ProseMirror {
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: none;
  line-break: normal;
  text-wrap: pretty;

  font-size: 1rem;
  letter-spacing: 0.01em;
  color: var(--text);
  min-width: 0;
}

.editor-container .prose {
  all: unset;
  display: block;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: break-word;
  font-family: system-ui, sans-serif;
  color: var(--text);
  margin-bottom: 10em;
  outline: none;
}

.ProseMirror:focus {
  outline: none;
  border: 0;
}

.editor-container .ProseMirror p,
.editor-container .ProseMirror li,
.editor-container .ProseMirror div {
  word-break: keep-all;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  hyphens: none;
}

.ProseMirror p.is-empty::before {
  content: attr(data-placeholder);
  color: #aaa;
  float: left;
  height: 0;
  pointer-events: none;
}

.search-result {
  background-color: orange;
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
