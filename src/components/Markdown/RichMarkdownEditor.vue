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

import { editor } from './Editor';
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
  id: number;
  editable?: boolean;
  data: Note;
  uuid: string;
}>()

const loader = ref<boolean>(true);
const searchBarVisible = ref<boolean>(false);
const colorCache = ref<string | null>(null);
const { user } = useUser();

let provider: SocketIOProvider | null = null;
let autosaveInterval: ReturnType<typeof setInterval> | null = null;

const focusEditor = () => editor.value?.commands.focus();

const handleSaveShortcut = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    saveNote(props.data.uuid);
  }
};

const startAutoSave = () => {
  autosaveInterval = setInterval(() => saveNote(props.data.uuid), 10 * 1000);
};

const getColorByImage = async (): Promise<string> => {
  if (colorCache.value) return colorCache.value;
  if (!user.value?.id) return '#6200ee';

  try {
    const res = await fetch(`${api_url}/api/user/by/id/${user.value.id}`, { credentials: 'include' });
    const data = await res.json();
    const color = data.imageUrl ? await getDominantColor(data.imageUrl) : '#6200ee';
    colorCache.value = color;
    return color;
  } catch {
    return '#6200ee';
  }
};


async function initEditor(): Promise<void>
{
  console.time('📊 Editor Init Total');
  const ydoc = new Y.Doc();
  
  // ✅ Create editor FIRST without provider (instant render)
  console.time('⚙️ Editor Creation');
  const mathCheckDebounced = createMathCheckDebounced();
  const defaultUserColor = '#6200ee';
  
  const todoInputExtension = createTodoInputExtension({
    value: editor,
  } as any);

  // Create editor with basic config (no collaboration yet)
  editor.value = new Editor({
    ...getEditorConfig({
      editable: props.editable,
      ydoc,
      provider: null, // ✅ No provider initially
      todoInputExtension,
      userColor: defaultUserColor,
      userName: user.value?.username || 'Invité',
      userAvatar: user.value?.imageUrl,
      onMathCheck: () => {
        if (editor.value) {
          mathCheckDebounced(editor.value as any);
        }
      },
    }),
  });

  console.timeEnd('⚙️ Editor Creation');
  
  // ✅ Load content immediately
  console.time('📄 Content Loading');
  await nextTick();
  
  if (editor.value && props.data.content) {
    loadDocumentContent(editor.value as any, ydoc, props.data.content);
  }

  console.timeEnd('📄 Content Loading');

  // ✅ Remove loader immediately (UI visible!)
  loader.value = false;
  console.timeEnd('📊 Editor Init Total');

  // ✅ Plug collaboration in the background
  console.time('⚡ Provider Init & Plugin');
  initializeProvider(
    api_url,
    props.data.uuid,
    user.value?.id || '',
    ydoc,
    (command, content) => {
      if (command === 'insertContent' && editor.value) {
        editor.value.commands.setContent(content, false);
      }
    }
  )
    .then((socketProvider) => {
      console.timeEnd('⚡ Provider Init & Plugin');
      provider = socketProvider;
      
      // Update editor with active provider
      if (editor.value && editor.value.extensionManager) {
        const collaborationExt = editor.value.extensionManager.extensions.find(
          ext => ext.name === 'collaboration'
        );
        if (collaborationExt) {
          collaborationExt.options.provider = socketProvider;
        }
      }

      console.log('✅ Collaboration enabled');
    })
    .catch((err) => {
      console.error('❌ Failed to initialize collaboration:', err);
      console.timeEnd('⚡ Provider Init & Plugin');
    });

  // ✅ Fetch user color in background
  console.time('🎨 User Color Fetch');
  getColorByImage()
    .then(color => {
      console.timeEnd('🎨 User Color Fetch');
      if (provider?.awareness) {
        const state = provider.awareness.getLocalState();
        if (state) {
          provider.awareness.setLocalState({ 
            ...state, 
            user: { ...state.user, color } 
          });
        }
      }
    })
    .catch(err => {
      console.timeEnd('🎨 User Color Fetch');
      console.warn('Failed to fetch user color:', err);
    });
};


onMounted(async () => {
  window.addEventListener('keydown', handleSaveShortcut)
  await initEditor();
  startAutoSave();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleSaveShortcut)
  if (editor.value) editor.value.destroy();
  clearMathCache();
  cleanupProvider(provider as any, autosaveInterval);
  saveNote(props.data.uuid);
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
