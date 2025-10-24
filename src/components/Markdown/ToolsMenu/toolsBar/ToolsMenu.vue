<template>

  <div>

    <slot />

    <teleport to="body">

      <div
        v-show="showMenu"
        class="context-menu dropdown h-10 flex flex-row bg-[var(--bg2)] overflow-auto "
        :style="{ top: `${posY}px`, left: `${posX}px` }"
      >

        <ul
          v-for="(list, cat) in actions"
          :key="cat"
          class="flex flex-row"
          :class="cat == 'MdInputMenu' ? '' : 'pr-1 border-r-1'"
        >

          <li
            v-for="action in list"
            :key="action.id"
            :class="cat == 'MdInputMenu' ? 'nohover' : ''"
          >
          
            <div
              v-if="'action' in action"
              :class="
                cat == 'MdInputMenu' 
                  ? `
                      border border-gray-400 hover:border-[var(--text)] 
                      transition-all duration-200 rounded-lg px-1.5
                    ` 
                  : ''
              "
              @click="exec(action.action)"
              v-html="action.name"
              v-tooltip.bottom="action.tooltip"
            ></div>

            
            <select
              v-else-if="'actions' in action"
              @change="onSelectAction($event, action.actions)"
              class="ml-1 rounded bg-[var(--bg2)]"
            >

              <option
                v-for="act in action.actions"
                :key="act.id"
                :value="act.id"
              >
                {{ act.name }}
              </option>

            </select>

          </li>

        </ul>

      </div>

      <MdInputeMenu 
        v-model:show="mdInputeMenu"
        :top="posY"
        :left="posX"
      />
      
    </teleport>

  </div>

</template>


<script setup lang="ts">

import { Editor } from '@tiptap/vue-3';
import { nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { Categories, SimpleAction } from '../ToolsMenuTypes';
import config from './ToolsMenuConfig.json';
import { editor } from '../../Editor';
import { onDragIconLoaded } from '../../tiptap-extensions/dragHandle';
import MdInputeMenu from '../mdInputType/mdInputMenu.vue';
const _config: any = config; // i can't assign categories type

const route = useRoute();
const router = useRouter();

const mdInputeMenu = ref<boolean>(false);
const actions = ref<Categories>(_config);
const showMenu = ref<boolean> (false);
const posX = ref<number>(0);
const posY = ref<number>(0);

const openSelectionMenu = (withEditorSelect: boolean) => {

  if (withEditorSelect) {

    if (!editor.value) return;

    const { from, to } = editor.value.state.selection;
    if (from === to) {
      showMenu.value = false;
      mdInputeMenu.value = false;
      return;
    }

    const middle = from;
    const coords = editor.value.view.coordsAtPos(middle);

    posX.value = coords.left + window.scrollX;
    posY.value = coords.top + window.scrollY - 40;

  }
  else {


  }

  setTimeout(() => {
    showMenu.value = true;
  }, 500)

}

const exec = (action: string) => {

  if (action.startsWith('getImageFile')) return insertImageFromFile(editor.value as Editor);
  if (action.startsWith('openMdInputMenu')) return openMdInputMenu();
  if (action.startsWith('AskToAI')) {
    AskToAI(
        action.replace('AskToAI', '').startsWith('(') 
          ? action
              .replace(/AskToAI/g, '')
              .replace(/[()']/g, '')
              .trim()
          : undefined
      );
  }

  const fn = new Function("editor", `return (${action})()`);
  fn(editor.value);

}

const onSelectAction = (event: Event, actionsList: SimpleAction[]) => {
  const select = event.target as HTMLSelectElement;
  const act: SimpleAction | undefined = actionsList.find(a => a.id == Number(select.value));
  if (act) exec(act.action);
};

const openMdInputMenu = () => {
  mdInputeMenu.value = !mdInputeMenu.value;
}

const insertImageFromFile = (editor: Editor) => {
  
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      editor.chain().focus().setImage({ src: url }).run();
    };
    reader.readAsDataURL(file);
  };

  input.click();
};


const AskToAI = (prompt?: string) => {

  router.push({
    query: {
      ...route.query,
      aiquery: undefined,
      chatbot: undefined
    }
  });

  setTimeout(() => {

    if (!editor.value) return;

    const { from, to } = editor.value.state.selection;
    router.push({
      query: {
        ...route.query,
        aiquery: prompt?.replace('undefined', '').trim() + editor.value.state.doc.textBetween(from, to, ' '),
        chatbot: 'fixed'
      }
    });

    showMenu.value = false;
    mdInputeMenu.value = false;

  }, 100);

}


watch(
  () => editor.value?.state.selection,
  async () => {
    await nextTick()
    openSelectionMenu(true)
  }
)

onDragIconLoaded(() => {
  const doc = document.querySelector('.drag-icon');
  if (!doc) return;
  doc.addEventListener('click', () => {
    openSelectionMenu(false);
  })
})

</script>

<style scoped>

.context-menu {
  position: absolute;
  min-width: 30em;
  z-index: 1000;
  border: 1px solid var(--btn);
  transition: all 0.3s;
}

.category-section {
  margin-bottom: 12px;
}

.category-section h3 {
  font-size: 14px;
  margin: 0 0 8px 0;
}

.category-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-section li {
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
}

</style>
