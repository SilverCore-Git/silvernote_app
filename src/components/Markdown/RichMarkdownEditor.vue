<template>

  <PhoneToolsBar />

  <ToolsMenu
      class="editor-container h-full overflow-hidden" 
      @click="focusEditor"
  >

    <div class="h-full">
      <EditorContent
        v-if="editor && !loader"
        :editor="editor as Editor"
        class="prose h-full mb-20"
      />
      <div v-else class="animate-pulse bg-gray-300 h-80 w-full rounded-xl"></div>
    </div>

  </ToolsMenu>

  <SearchBar
    v-model:visible="_searchBar"
  />

  <SaveIndicator />

  <MdInputBtn v-if="false && isMobile" />

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
import { CharacterCount, UndoRedo } from '@tiptap/extensions';
import Youtube from '@tiptap/extension-youtube';
import { Extension, InputRule } from '@tiptap/core';
import SlashCommand from '@/components/Markdown/tiptap-extensions/SlachCommand.js';
import { IndentExtension } from './tiptap-extensions/IndentExtension.js';
import FileHandler from '@tiptap/extension-file-handler';
import { noteBtnLink } from './tiptap-extensions/noteBtnLink';
import { handleImageUpload, MAX_FILE_SIZE, imageUploadNode } from './tiptap-extensions/image-upload-node/';
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
import ToolsMenu from '@/components/Markdown/ToolsMenu/toolsBar/ToolsMenu.vue';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight'
import { Table, TableCell, TableRow } from './tiptap-extensions/table/tableExtansion.js';
//import { Table, TableCell, TableRow } from '@tiptap/extension-table';

import { editor, isLoaded } from './Editor';
import { saveNote } from './Function/saveNote.js';
import SaveIndicator from './SaveIndicator.vue';
import MdInputBtn from './MdInputBtn.vue';
import isMobile from '@/assets/ts/utils/isMobile.js';
import PhoneToolsBar from './ToolsMenu/phoneToolsBar/phoneToolsBar.vue';
//import { SelectionRectangle } from './tiptap-extensions/SelectionRectangle.js';

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

const startAutoSave = () => {
  autosaveInterval = setInterval(() => saveNote(props.data.id), 10 * 1000);
};

const handleSaveShortcut = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    saveNote(props.data.id);
  }
}


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

  await new Promise<void>((resolve) => {
    if (provider?.socket.connected) {
      // Déjà connecté, attendre le sync
      provider.socket.once('sync', () => {
        console.log('Initial sync completed');
        resolve();
      });
    } else {
      // Attendre la connexion puis le sync
      provider?.socket.once('connect', () => {
        provider?.socket.once('sync', () => {
          console.log('Initial sync completed');
          resolve();
        });
      });
    }
    
    // Timeout de sécurité après 5 secondes
    setTimeout(() => {
      console.warn('Sync timeout, proceeding anyway');
      resolve();
    }, 5000);
  });

  const color = await getColorByImage();

  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        history: false,
        blockquote: false
      }),
      TaskList,
      TodoInput,
      noteBtnLink,
      SlashCommand,
      SearchAndReplace,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Youtube.configure({ HTMLAttributes: { class: 'ytb-viewer' } }),
      UndoRedo,
      Color,
      imageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error: any) => console.error('Upload failed:', error),
      }),
      TextStyle,
      Highlight.configure({
        multicolor: true
      }),
      CharacterCount,
      Table,
      TableCell,
      TableRow,
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

  const fragment = ydoc.getXmlFragment('prosemirror');
  
  if (fragment.length === 0 && props.data.content && props.data.content.trim() !== '') 
  {
    console.log('Loading HTML content from database (document is empty)');
    editor.value?.commands.setContent(props.data.content);
  } 
  else if (fragment.length > 0) 
  {
    console.log('Document already has collaborative content, skipping HTML load');
  } else 
  {
    console.log('New empty document');
  }

  isLoaded.value = true;
  loader.value = false;

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
  window.addEventListener('keydown', handleSaveShortcut)
  initEditor();
  startAutoSave();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize);
  window.removeEventListener('keydown', handleSaveShortcut)
  if (editor.value) editor.value.destroy();
  if (provider) provider.destroy();
  if (autosaveInterval) clearInterval(autosaveInterval);
  saveNote(props.data.id);
});

window.addEventListener('beforeunload', () => {
  provider?.destroy();
});

</script>


<style>

@import './tiptap-extensions/table/table-styles.css';
@import './css/basic.css';
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

/* SelectionRectangle */
.selection-rectangle {
  border: 2px dashed var(--btn);
  background-color: rgba(255, 116, 51, 0.2);
  position: absolute;
  pointer-events: none;
  z-index: 9999;
}


</style>
