<template>

  <div>

    <teleport to="body">

      <div 
        v-if="isMobile && mdInputeMenu || IfcolorEditor"
        class="fixed inset-0 z-10"
        @click="closeAll"
      ></div>

      <div
        v-if="isMobile"
        class="
                h-10 flex flex-row justify-between items-center
                fixed bottom-0 inset-x-0 z-100 overflow-hidden
                bg-(--bg2) dropdown text-lg
              "
      >

        <ul
          v-for="(list, cat) in actions"
          :key="cat"
          class="flex flex-row"
          :class="cat == 'MdInputMenu' ? '' : ''"
        >

          <li
            v-for="action in list"
            :key="action.id"
            :class="cat == 'MdInputMenu' ? 'nohover' : ''"
          >
          
            <div
              v-if="'action' in action"
              :class="
                cat == 'MdInputMenu' || action.id == 764532
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
        class="fixed bottom-10 right-0 z-20"
        search-type="props"
      />

      <colorEditor 
        v-model:show="IfcolorEditor"
        class="fixed bottom-10 right-35 z-20"
      />
      
    </teleport>

  </div>

</template>


<script setup lang="ts">

import { Editor } from '@tiptap/vue-3';
import { ref } from 'vue';

import type { Categories, SimpleAction } from '../ToolsMenuTypes';
import config from './phoneToolsBarConfig.json';
import { editor } from '../../Editor';
import MdInputeMenu from '../mdInputType/mdInputMenu.vue';
import colorEditor from '../colorEditor/colorEditor.vue';
import isMobile from '@/assets/ts/utils/isMobile';
const _config: any = config; // i can't assign categories type

const IfcolorEditor = ref<boolean>(false);
const mdInputeMenu = ref<boolean>(false);
const actions = ref<Categories>(_config);


const exec = (action: string) => {

  if (action.startsWith('getImageFile')) return insertImageFromFile(editor.value as Editor);
  if (action.startsWith('openMdInputMenu')) return openMdInputMenu();
  if (action.startsWith('openColorEditor')) return openColorEditor();

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
  IfcolorEditor.value = false;
}

const openColorEditor = () => {
  IfcolorEditor.value = !IfcolorEditor.value;
  mdInputeMenu.value = false;
}

const closeAll = () => {
  mdInputeMenu.value = false;
  IfcolorEditor.value = false;
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

</script>

<style scoped>

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
