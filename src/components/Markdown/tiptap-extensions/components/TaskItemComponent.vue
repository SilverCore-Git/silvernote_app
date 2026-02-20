<template>

  <node-view-wrapper 
    class="
      todo-item-container group flex items-start gap-3 my-1 w-full
    "
  >
    
    <div 
      class="flex-none flex items-center justify-center h-6 select-none cursor-pointer"
      contenteditable="false"
      @mousedown.prevent
    >
      <div 
        @click.stop.prevent="toggle"
        class="w-5 h-5 rounded-md border-2 transition-all duration-200! flex items-center justify-center"
        :class="node.attrs.checked 
          ? 'bg-(--btn) border-(--btn) shadow-[0_0_10px_rgba(var(--btn),0.3)]' 
          : 'border-(--text)/20 hover:border-(--text)/40 bg-(--text)/5'"
      >
        <i v-if="node.attrs.checked" class="bi bi-check-lg text-(--text) text-xs font-bold" />
      </div>
    </div>

    <node-view-content 
      class="flex-1 min-w-0 outline-none transition-all duration-300 break-words"
      :class="{ 'opacity-40 line-through decoration-2': node.attrs.checked }"
    />

  </node-view-wrapper>

</template>

<script setup>

import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const toggle = () => {
  props.updateAttributes({
    checked: !props.node.attrs.checked,
  })
}

</script>

<style>

ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.todo-item-container node-view-content > * {
  margin: 0 !important;
  line-height: 1.5;
}

.todo-item-container p {
  margin: 0 !important;
}

</style>