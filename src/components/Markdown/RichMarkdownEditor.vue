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
    v-model:visible="searchBarVisible"
  />

  <SaveIndicator />

</template>

<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { useUser } from '@clerk/vue';

import * as Y from 'yjs';

import type { Note } from '@/assets/ts/type';
import { api_url } from '@/assets/ts/backend_link';
import { getDominantColor } from '@/assets/ts/GetColorByImage';

import { editor, isLoaded } from './Editor';
import { saveNote } from './Function/saveNote.js';
import ToolsMenu from '@/components/Markdown/ToolsMenu/toolsBar/ToolsMenu.vue';
import SaveIndicator from './SaveIndicator.vue';
import PhoneToolsBar from './ToolsMenu/phoneToolsBar/phoneToolsBar.vue';
import { SearchBar } from './tiptap-extensions/searchAndReplace';
import type { SocketIOProvider } from './SocketIOProvider';

import { getEditorConfig } from './editorConfig';
import { createMathCheckDebounced, clearMathCache } from './tiptap-extensions/mathExtension';
import { createTodoInputExtension } from './tiptap-extensions/todoExtension';
import { initializeProvider, loadDocumentContent, cleanupProvider } from './providerManager';
import './css/DragHandler.scss';

const props = defineProps<{
  id: number
  editable?: boolean
  data: Note
  uuid: string
}>()

const isLargeScreen = ref<boolean>(window.innerWidth >= 1024);
const loader = ref<boolean>(true);
const searchBarVisible = ref<boolean>(false);
const { user } = useUser();

let provider: SocketIOProvider | null = null;
let autosaveInterval: ReturnType<typeof setInterval> | null = null;

const focusEditor = () => editor.value?.commands.focus();

const handleSaveShortcut = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    saveNote(props.data.id);
  }
};

const updateSize = () => { isLargeScreen.value = window.innerWidth >= 1024; };

const startAutoSave = () => {
  autosaveInterval = setInterval(() => saveNote(props.data.id), 10 * 1000);
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


const initEditor = async () => {
  const ydoc = new Y.Doc();
  const todoInputExtension = createTodoInputExtension({
    value: editor.value,
  } as any);
  const userColor = await getColorByImage();

  // Initialize provider with sync handling
  provider = await initializeProvider(
    api_url,
    props.data.uuid,
    user.value?.id || '',
    ydoc,
    (command, content) => {
      if (command === 'insertContent' && editor.value) {
        editor.value.commands.setContent(content);
      }
    }
  );

  const mathCheckDebounced = createMathCheckDebounced();

  // Create editor with optimized config
  editor.value = new Editor({
    ...getEditorConfig({
      editable: props.editable,
      ydoc,
      provider: provider as any,
      todoInputExtension,
      userColor,
      userName: user.value?.username || 'Invité',
      userAvatar: user.value?.imageUrl,
      onMathCheck: () => {
        if (editor.value) {
          mathCheckDebounced(editor.value as any);
        }
      },
    }),
  });

  await nextTick();

  // Load content
  if (editor.value) {
    loadDocumentContent(editor.value as any, ydoc, props.data.content);
  }

  isLoaded.value = true;
  loader.value = false;
};


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
  clearMathCache();
  cleanupProvider(provider as any, autosaveInterval);
  saveNote(props.data.id);
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
