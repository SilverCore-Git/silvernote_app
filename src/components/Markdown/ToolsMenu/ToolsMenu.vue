<template>

<PressAndHold
  @long-press="openSelectionMenu(false)"
>

  <div>

    <slot />

    <div
      v-if="showMenu"
      class="context-menu dropdown h-10 flex flex-row bg-[var(--bg2)] overflow-auto -translate-x-60"
      :style="{ top: `${posY}px`, left: `${posX}px` }"
    >

      <ul
        v-for="(list, cat) in actions"
        :key="cat"
        class="flex flex-row"
        :class="cat == 'plus' ? '' : 'pr-1 border-r-1'"
      >

        <li
          v-for="action in list"
          :key="action.id"
        >
        
          <div
            v-if="'action' in action"
            @click="exec(action.action)"
            v-html="action.name"
            class=""
          ></div>

          
          <select
            v-else-if="'actions' in action"
            @change="onSelectAction($event, action.actions)"
            class="ml-1 rounded"
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

  </div>

</PressAndHold>

</template>


<script setup lang="ts">

import { Editor } from '@tiptap/vue-3';
import { nextTick, ref, watch } from 'vue'

import type { Categories, SimpleAction } from '@/components/Markdown/ToolsMenu/ToolsMenuTypes';
import config from '@/components/Markdown/ToolsMenu/ToolsMenuConfig.json';
import PressAndHold from '@/components/PressAndHold.vue';
const _config: any = config; // i can't assign categories type

const props = defineProps<{
    editor?: Editor;
}>();


const actions = ref<Categories>(_config);
const showMenu = ref<boolean> (false)
const posX = ref<number>(0)
const posY = ref<number>(0)



const openSelectionMenu = (withEditorSelect: boolean) => {

  if (withEditorSelect) {

    const editor = props.editor;
    if (!editor) return;

    const { from, to } = editor.state.selection;
    if (from === to) {
      showMenu.value = false;
      return;
    }

    const middle = Math.floor((from + to) / 2);
    const coords = editor.view.coordsAtPos(middle);

    posX.value = coords.left + window.scrollX;
    posY.value = coords.top + window.scrollY - 40;

  }
  else {
    document.addEventListener('contextmenu', (e) => {

      e.preventDefault();

      posX.value = e.clientX;
      posY.value = e.clientY;

    })
  }

  setTimeout(() => {
    showMenu.value = true;
  }, 500)

}

// const closeMenu = () => {
//   showMenu.value = false
// }

const exec = (action: string) => {

  if (action.startsWith('getImageFile')) return insertImageFromFile(props.editor as Editor);

  const fn = new Function("editor", `return (${action})()`);
  fn(props.editor);

}

const onSelectAction = (event: Event, actionsList: SimpleAction[]) => {
  const select = event.target as HTMLSelectElement;
  const act: SimpleAction | undefined = actionsList.find(a => a.id == Number(select.value));
  if (act) exec(act.action);
};


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



watch(
  () => props.editor?.state.selection,
  async () => {
    await nextTick()
    openSelectionMenu(true)
  }
)

</script>

<style scoped>

.context-menu {
  position: absolute;
  min-width: 38em;
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
