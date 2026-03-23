<template>

  <ToolsMenu
      class="editor-container h-full overflow-hidden relative" 
      @click="focusEditor"
      :disable="loader || !props.editable"
  >

    <div
      v-if="editor"
      v-show="!loader"
      class="h-full"
    >

      <EditorContent
        :editor="(editor as unknown as Editor)"
        class="prose h-full max-w-screen"
      />

    </div>

    <transition name="fade">

      <div
        v-if="loader"
        class="
          z-100 absolute inset-0
          rounded-xl bg-(--bg)
        "
      />

    </transition>

  </ToolsMenu>

  <SearchBar
    v-model:visible="searchBarVisible"
  />

  <SaveIndicator />

  <PhoneToolsBar v-if="!loader || props.editable" />
  
</template>

<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { useUser } from '@clerk/vue';

import * as Y from 'yjs';

import { api_url } from '@/assets/ts/backend_link';
import { getDominantColor } from '@/assets/ts/GetColorByImage';

import { editor } from './Editor';
import ToolsMenu from '@/components/Markdown/ToolsMenu/toolsBar/ToolsMenu.vue';
import SaveIndicator from './SaveIndicator.vue';
import PhoneToolsBar from './ToolsMenu/phoneToolsBar/phoneToolsBar.vue';
import { SearchBar } from './tiptap-extensions/searchAndReplace';
import { EditorProvider } from './EditorProvider';

import { getEditorConfig } from './editorConfig';
import { createMathCheckDebounced, clearMathCache } from './tiptap-extensions/mathExtension';
import './css/DragHandler.scss';
import './css/CodeBlock.scss';
import getContrastColor from '@/assets/ts/utils/getContrastColor.js';
import { useWSocket } from '@/composables/WSocket';
import waitFor from '@/assets/ts/utils/waitFor';

const props = defineProps<{
  editable?: boolean;
  uuid: string;
  shared?: boolean;
}>()

const loader = ref<boolean>(true);
const searchBarVisible = ref<boolean>(false);
const colorCache = ref<string | null>(null);
const { user } = useUser();


const focusEditor = () => editor.value?.commands.focus();

const handleSaveShortcut = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') 
  {
    e.preventDefault();
    useWSocket().then(socket => socket.value.emit('save-room', { room: props.uuid }));
  }
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

const handleScroll = (editor: Editor) => {
  return;
  
  setTimeout(() => {

    const { view } = editor;
    const { selection } = view.state;
    const { $from } = selection;

    const lineIndex = $from.index(0);
    if (lineIndex < 3) return;

    const coords = view.coordsAtPos(selection.from);
    const node = document.elementFromPoint(coords.left, coords.top);

    if (node instanceof HTMLElement)
    {
      node.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }

  }, 50);

};


async function initEditor(): Promise<void>
{

  console.time('Start init editor');

  const ydoc = new Y.Doc();

  const defaultUserColor = '#6200ee';
  let userColor = defaultUserColor;

  const colorPromise = getColorByImage();

  const provider = new EditorProvider(ydoc, props.uuid, props.shared);
  
  const mathCheckDebounced = createMathCheckDebounced();
  
  editor.value = new Editor({
    ...getEditorConfig({
      editable: props.editable,
      ydoc,
      provider,
      userColor,
      userName: user.value?.username || 'Invité',
      userAvatar: user.value?.imageUrl,
      onMathCheck: () => {
        if (editor.value) {
          mathCheckDebounced(editor.value as any);
        }
      },
    }),
    editable: props.editable,

    onFocus({ editor }) {
      handleScroll(editor as Editor);
    },
    onSelectionUpdate({ editor }) {
      handleScroll(editor as Editor);
    },

  editorProps: {
    handleDOMEvents: {
      mousedown: (_view, event) => {
        const target = event.target as HTMLElement;
        if (
            target instanceof HTMLInputElement &&
            target.type === 'checkbox' && 
            target.closest('.task-list')
        ) {}
        return false;
      },
    },
  },

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

  await waitFor(() => provider.synced);

  await nextTick();

  console.log('Editor initialized');
  loader.value = false;

};

watch(() => props.uuid, async () => {
  
  if (editor.value) {
    editor.value.destroy();
    editor.value = undefined;
  }
  
  loader.value = true;
  
  await initEditor();

}, { immediate: false });

onMounted(async () => {
  window.addEventListener('keydown', handleSaveShortcut)
  await initEditor();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleSaveShortcut)
  if (editor.value) editor.value.destroy();
  clearMathCache();
});

</script>


<style>

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
  scroll-behavior: smooth;
  overflow-y: auto;
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


.fade-enter-active,
.fade-leave-active {
  transition: opacity .1s ease-in-out !important;
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
