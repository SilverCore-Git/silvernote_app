<template>
  <div class="w-full h-full">
    <editor-content 
        v-if="loaded"
        :editor="editor as Editor" 
        class="prose max-w-none" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TableKit } from "@tiptap/extension-table";
import { Markdown } from "tiptap-markdown";

const props = defineProps<{
  content: string | Promise<string>;
}>();

const editor = ref<Editor | null>(null);
const loaded = ref<boolean>(false);

onMounted(() => {

    editor.value = new Editor({
        extensions: [
          StarterKit,
          Underline,
          Link.configure({ openOnClick: true }),
          Markdown.configure({ html: true }),
          TaskList,
          TaskItem,
          TableKit,
        ],
        content: props.content,
        editable: false,
    });

    setTimeout(() => {
        loaded.value = true;
    }, 500)

});


onBeforeUnmount(() => {
  editor.value?.destroy();
});

</script>

<style lang="css" scoped>

@import './css/basic.css';
@import './css/Table.css';
@import './css/ToDoList.css';

</style>