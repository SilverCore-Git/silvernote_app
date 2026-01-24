<template>

  <div class="relative">

    <slot />

    <teleport to="body">

      <div
        v-if="showMenu || mdInputeMenu || IfcolorEditor"
        class="fixed inset-0 z-500"
        @click="closeAll"
      />

      <div
        v-if="!isMobile && showMenu && editor"
        class="context-menu"
        :style="{ top: `${posY}px`, left: `${posX}px` }"
      >

        <div
          class="
            flex flex-row h-10 items-center
            px-1 bg-(--white) shadow-xl
            rounded-lg border border-(--btn)
          "
        >

          <ul
            v-for="(list, cat) in menuWithState"
            :key="cat"
            class="flex flex-row items-center h-full px-1"
            :class="cat !== 'MdInputMenu' ? 'border-r border-gray-200 mr-1' : ''"
          >

            <li
              v-for="action in list"
              :key="action.id"
              class="px-0.5"
            >

              <button

                v-if="'action' in action"
                class="menu-btn transition-all duration-200 px-2 py-1 rounded-md text-sm font-medium"
                :class="[
                  action.isActiveState ? 'bg-(--btn) text-(--bg)' : 'hover:bg-(--bg)',
                  (cat === 'MdInputMenu' || action.id === 764532) ? 'border border-gray-400' : ''
                ]"

                @click="execAction(action.action)"
                v-html="action.name"
                v-tooltip.bottom="action.tooltip"

              />


            </li>

          </ul>

        </div>

      </div>

    </teleport>

    <Teleport to="body">

      <MdInputeMenu 
        v-model:show="mdInputeMenu" 
        :top="menuPosY" 
        :left="menuPosX"
        class="z-700"
      />

      <colorEditor 
        v-model:show="IfcolorEditor" 
        :top="menuPosY" 
        :left="menuPosX"
        class="z-700" 
      />

    </Teleport>

  </div>

</template>

<script setup lang="ts">

import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

import useSilverIA from '@/components/silveria/composables/useSilverIA';
import type { Categories } from '../ToolsMenuTypes';
import config from './ToolsMenuConfig.json';
import { editor } from '../../Editor';
import MdInputeMenu from '../mdInputType/mdInputMenu.vue';
import colorEditor from '../colorEditor/colorEditor.vue';
import isMobile from '@/assets/ts/utils/isMobile';


const { sendToSilverIA } = useSilverIA();
const route = useRoute();
const _config = config as any;

const showMenu = ref<boolean>(false);
const mdInputeMenu = ref<boolean>(false);
const IfcolorEditor = ref<boolean>(false);
const posX = ref<number>(0);
const posY = ref<number>(0);
const menuPosX = ref<number>(0);
const menuPosY = ref<number>(0);
const mouseX = ref<number>(0);
const mouseY = ref<number>(0);
const editorTick = ref<number>(0);

const fnCache = new Map<string, Function>();



const menuWithState = computed(() => {
  editorTick.value; 
  if (!editor.value) return _config as Categories;

  const newState = JSON.parse(JSON.stringify(_config));
  for (const cat in newState) {
    newState[cat].forEach((item: any) => {
      if (item.isActive) {
        item.isActiveState = execCheck(item.isActive);
      }
    });
  }
  return newState as Categories & Record<string, any>;
});


const updateMenuPosition = () => {
  if (!editor.value) return;

  const { from, to } = editor.value.state.selection;
  
  if (from === to) {
    if (!mdInputeMenu.value && !IfcolorEditor.value) showMenu.value = false;
    return;
  }

  const { view } = editor.value;
  const start = view.coordsAtPos(from);
  const end = view.coordsAtPos(to);

  const centerX = (start.left + end.left) / 2;

  posX.value = centerX + window.scrollX;
  posY.value = start.top + window.scrollY - 10; // Positionné juste au dessus du texte

  showMenu.value = true;

};


const execAction = (actionStr: string) => {

  if (!actionStr) return;


  if (actionStr.includes('getImageFile')) {
    insertImageFromFile();
    return closeAll();
  }
  if (actionStr.includes('openMdInputMenu')) {
    IfcolorEditor.value = false;
    mdInputeMenu.value = !mdInputeMenu.value;
    return;
  }
  if (actionStr.includes('openColorEditor')) {
    mdInputeMenu.value = false;
    IfcolorEditor.value = !IfcolorEditor.value;
    return;
  }
  if (actionStr.includes('AskToAI')) {
      const prompt = actionStr.match(/'([^']+)'/)?.[1] || "";
      AskToAI(prompt);
      return closeAll();
  }

  try {

    if (!fnCache.has(actionStr)) {
      fnCache.set(actionStr, new Function("editor", `return (${actionStr})(editor)`));
    }
    fnCache.get(actionStr)!(editor.value);
    editorTick.value++;

  } catch (e) {
    console.error("Exec error:", e);
  }

};

const closeAll = () => {
  showMenu.value = false;
  mdInputeMenu.value = false;
  IfcolorEditor.value = false;
};

const trackMouse = (e: MouseEvent) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
};


const execCheck = (checkStr: string): boolean => {
  try {
    if (!fnCache.has(checkStr)) {
      fnCache.set(checkStr, new Function("editor", `return (${checkStr})(editor)`));
    }
    return !!fnCache.get(checkStr)!(editor.value);
  } catch {
    return false;
  }
};



const AskToAI = (prompt: string) => {
  if (!editor.value) return;
  const { from, to } = editor.value.state.selection;
  const selectedText = editor.value.state.doc.textBetween(from, to, ' ');

  sendToSilverIA({ text: `${prompt} : ${selectedText}`, route });

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


const handleUpdate = () => {
  editorTick.value++;
  updateMenuPosition();
};

watch(() => mdInputeMenu.value, () => {
  menuPosX.value = mouseX.value - 80;
  menuPosY.value = mouseY.value + 25;
});

watch(() => IfcolorEditor.value, () => {
  menuPosX.value = mouseX.value - 80;
  menuPosY.value = mouseY.value + 25;
});

onMounted(() => {
  window.addEventListener('mousemove', trackMouse);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', trackMouse);
});

watch(() => editor.value?.state.selection, handleUpdate);

</script>

<style scoped>
.context-menu {
  position: absolute;
  z-index: 1000;
  pointer-events: auto;
  transform: translate(-50%, -100%); /* Centre horizontalement et place au dessus du point Y */
}

.menu-btn {
  cursor: pointer;
  white-space: nowrap;
}

.overflow-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.overflow-auto::-webkit-scrollbar {
  display: none;
}
</style>