<template>

  <ToolsMenu
      class="editor-container h-full overflow-hidden" 
      @click="focusEditor"
  >

    <div
      v-if="editor"
      v-show="!loader"
      class="h-full"
    >

      <EditorContent
        :editor="editor as Editor"
        class="prose h-full"
      />

    </div>

    <div
      v-if="loader"
      class="
        z-100 h-full w-full absolute
        rounded-xl bg-(--text-little)/30
      "
      style="animation: flash 2.5s ease-in-out infinite;"
    />

    <div
      v-if="loader"
      class="
        z-80 h-full w-full absolute
        rounded-xl bg-(--bg)
      "
    />

  </ToolsMenu>

  <SearchBar
    v-model:visible="searchBarVisible"
  />

  <SaveIndicator />

  <PhoneToolsBar />
  
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
import { EditorProvider } from './EditorProvider';

import { getEditorConfig } from './editorConfig';
import { createMathCheckDebounced, clearMathCache } from './tiptap-extensions/mathExtension';
import { createTodoInputExtension } from './tiptap-extensions/todoExtension';
import './css/DragHandler.scss';
import getContrastColor from '@/assets/ts/utils/getContrastColor.js';
import waitFor from '@/assets/ts/utils/waitFor.js';

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

let autosaveInterval: ReturnType<typeof setInterval> | null = null;

const focusEditor = () => editor.value?.commands.focus();

const handleSaveShortcut = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    saveNote(props.data.uuid, { force: true });
  }
};

const startAutoSave = () => {
  autosaveInterval = setInterval(() => saveNote(props.data.uuid), 10 * 1000);
};

const getColorByImage = async (): Promise<{ bg: string, text: string }> => {
  
  const defaultBg = '#6200ee';

  const getResult = (bg: string) => ({
    bg: bg,
    text: getContrastColor(bg)
  });

  if (colorCache.value) return getResult(colorCache.value);
  if (!user.value?.id) return getResult(defaultBg);

  try {
    const res = await fetch(`${api_url}/api/user/by/id/${user.value.id}`, { credentials: 'include' });
    const data = await res.json();
    const color = data.imageUrl ? await getDominantColor(data.imageUrl) : defaultBg;
    
    colorCache.value = color;
    return getResult(color);
  } catch {
    return getResult(defaultBg);
  }

};


async function initEditor(): Promise<void>
{

  console.time('Start init editor');

  const ydoc = new Y.Doc();

  const defaultUserColor = '#6200ee';
  let userColor = defaultUserColor;

  const colorPromise = getColorByImage();

  const provider = new EditorProvider(ydoc, props.uuid, props.editable ?? true);
  
  const mathCheckDebounced = createMathCheckDebounced();
  
  const todoInputExtension = createTodoInputExtension({
    value: editor,
  } as any);

  editor.value = new Editor({
    ...getEditorConfig({
      editable: props.editable,
      ydoc,
      provider,
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
    editable: props.editable
  });

  await nextTick();

  colorPromise.then(({ bg, text }) => {
    
    userColor = bg; 

    if (provider?.awareness) {
      const state = provider.awareness.getLocalState();
      if (state) {
        provider.awareness.setLocalState({ 
          ...state, 
          user: { 
            ...state.user, 
            color: bg,
            textColor: text
          } 
        });
      }
    }
  }).catch(err => console.warn('Failed to fetch user color:', err));

  await nextTick();

  await waitFor(() => provider.synced, 10_000);
  
  if (editor.value && props.data.content && editor.value.getText().length <= 0) {
    console.log('len : ', editor.value?.getText().length)
    editor.value.commands.setContent(props.data.content);
  }

  console.log('Editor initialized');
  loader.value = false;

};


onMounted(async () => {
  window.addEventListener('keydown', handleSaveShortcut)
  await initEditor();
  startAutoSave();
});

onBeforeUnmount(() => {
  saveNote(props.data.uuid);
  window.removeEventListener('keydown', handleSaveShortcut)
  if (editor.value) editor.value.destroy();
  clearMathCache();
  autosaveInterval && clearInterval(autosaveInterval);
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
