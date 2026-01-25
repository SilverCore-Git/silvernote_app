<template>

  <div>

    <teleport to="body">

      <div
        v-if="isMobile"
        class="
          h-12 flex flex-row justify-between items-center
          fixed bottom-0 inset-x-0 z-100 overflow-x-auto overflow-y-hidden
          bg-(--white) text-xl shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
          border-t border-(--btn) rounded-t-xl scrollbar-hide
        "
      >

        <ul
          v-for="(list, cat) in menuWithState"
          :key="cat"
          class="flex flex-row items-center gap-1 mx-1"
          :class="{ 'border-l border-gray-200 pl-2': cat !== 'text' }"
        >

          <li
            v-for="action in list"
            :key="action.id"
          >

            <button
              v-if="'action' in action && editor"
              class="
                flex items-center justify-center
                min-w-9 h-9 rounded-lg
                transition-all duration-200
                active:scale-95
                cursor-pointer
              "
              :class="[
                action.isActiveState
                  ? 'bg-(--btn) text-(--bg)' 
                  : 'text-(--text) hover:bg-(--bg)',

                (cat === 'MdInputMenu' || action.id === 764532)
                  ? 'border border-gray-300' 
                  : ''
              ]"

              @click="execAction(action.action)"
              v-html="action.name"
              v-tooltip.top="action.tooltip"
            />

          </li>

        </ul>

      </div>

      <MdInputeMenu 
        v-model:show="mdInputeMenu"
        class="fixed bottom-14 right-2 z-60"
        search-type="props"
      />

      <colorEditor 
        v-model:show="IfcolorEditor"
        class="fixed bottom-12 right-12 z-110"
      />
      
    </teleport>

  </div>

</template>

<script setup lang="ts">

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { editor } from '../../Editor';
import isMobile from '@/assets/ts/utils/isMobile';

import MdInputeMenu from '../mdInputType/mdInputMenu.vue';
import colorEditor from '../colorEditor/colorEditor.vue';

import config from './phoneToolsBarConfig.json';

interface ToolAction {
  id: number;
  name: string;
  action: string;
  isActive?: string;
  tooltip?: string;
  isActiveState?: boolean; 
}

type ConfigType = Record<string, ToolAction[]>;

const _config = config as ConfigType;
const IfcolorEditor = ref<boolean>(false);
const mdInputeMenu = ref<boolean>(false);
const editorTick = ref<number>(0);

  
const menuWithState = computed(() => {
  
  editorTick.value;

  if (!editor.value) return _config;

  const computedConfig: any = {};

  Object.keys(_config).forEach((cat) => {
    computedConfig[cat] = _config[cat].map((item) => {
      return {
        ...item,
        isActiveState: item.isActive ? execCheck(item.isActive) : false
      };
    });
  });

  return computedConfig as ConfigType & { isActiveState: boolean };

});



const fnCache = new Map<string, Function>();


const execAction = (actionStr: string) => {

  if (!editor.value) return;

  if (actionStr.includes('getImageFile')) return insertImageFromFile();
  if (actionStr.includes('openMdInputMenu')) return openMdInputMenu();
  if (actionStr.includes('openColorEditor')) return openColorEditor();

  
  try {

    if (!fnCache.has(actionStr)) {
      fnCache.set(actionStr, new Function("editor", `return (${actionStr})(editor)`));
    }
    const fn = fnCache.get(actionStr);
    fn?.(editor.value);
    
    editorTick.value++; 

  } catch (e) {
    console.error("Action Error:", e);
  }

};


const execCheck = (checkStr: string): boolean => {

  if (!editor.value) return false;

  try {

    if (!fnCache.has(checkStr)) {
      fnCache.set(checkStr, new Function("editor", `return (${checkStr})(editor)`));
    }
    const fn = fnCache.get(checkStr);
    return !!fn?.(editor.value);

  } catch {
    return false;
  }

};


const updateTick = () => { editorTick.value++; };

onMounted(() => {
  if (editor.value) {
    editor.value.on('transaction', updateTick);
    editor.value.on('selectionUpdate', updateTick);
  }
});

onUnmounted(() => {
  if (editor.value) {
    editor.value.off('transaction', updateTick);
    editor.value.off('selectionUpdate', updateTick);
  }
});

const openMdInputMenu = () => {
  mdInputeMenu.value = !mdInputeMenu.value;
  IfcolorEditor.value = false;
};

const openColorEditor = () => {
  IfcolorEditor.value = !IfcolorEditor.value;
  mdInputeMenu.value = false;
};

const insertImageFromFile = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = () => {
    const file = input.files?.[0];
    if (file && editor.value) {
      const reader = new FileReader();
      reader.onload = () => {
        editor.value?.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>