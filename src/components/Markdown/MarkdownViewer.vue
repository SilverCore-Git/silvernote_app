<template>
  <div class="w-full h-full">
    <editor-content 
        v-if="loaded"
        :editor="(editor as unknown as Editor)" 
        class="prose max-w-none" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Editor, EditorContent, VueNodeViewRenderer } from "@tiptap/vue-3";

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Markdown } from 'tiptap-markdown';
import FileHandler from '@tiptap/extension-file-handler';
import { noteBtnLink } from './tiptap-extensions/noteBtnLink';
import FileHandler_configure from './tiptap-extensions/FileHandler_configure.js';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import lowlight from './utils/lowlight.js';
import { Table, TableCell, TableRow, TableHeader } from '@tiptap/extension-table';
import CodeBlockLowlightComponent from './tiptap-extensions/components/CodeBlockLowlightComponent.vue';
import ImageComponent from './tiptap-extensions/components/ImageComponent.vue';
import TableComponent from './tiptap-extensions/components/TableComponent.vue';
import TaskItemComponent from './tiptap-extensions/components/TaskItemComponent.vue';
import * as Y from 'yjs';
import Collaboration from '@tiptap/extension-collaboration';


const props = defineProps<{
  content: Uint8Array;
}>();

const editor = ref<Editor | null>(null);
const loaded = ref<boolean>(false);

onMounted(() => {

    const ydoc = new Y.Doc();

    if (props.content && props.content.length > 0) 
    {
        Y.applyUpdate(ydoc, props.content);
    }

    editor.value = new Editor({
        extensions: [
          StarterKit.configure({
            history: false,
            codeBlock: false,
            code: false,
            blockquote: false,
            bulletList: {
              keepMarks: true,
              keepAttributes: false,
            },
            orderedList: {
              keepMarks: true,
              keepAttributes: false,
            },
          }),
          Collaboration.configure({
            document: ydoc,
          }),
          noteBtnLink,
          Blockquote,
          Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
          Underline,
          Image
            .extend({
              addNodeView() {
                return VueNodeViewRenderer(ImageComponent)
              }
            })
            .configure({ inline: false, allowBase64: true }),
          CodeBlockLowlight
            .extend({
              addNodeView() {
                return VueNodeViewRenderer(CodeBlockLowlightComponent)
              }
            })
            .configure({
              lowlight,
            }),
          TextStyle,
          Highlight.configure({
            multicolor: true,
          }),
          Table
            .extend({
              addNodeView() {
                return VueNodeViewRenderer(TableComponent)
              },
            }).configure({
              resizable: true
            }),
          TableCell,
          TableRow,
          TableHeader,
          Markdown.configure({ html: true }),
          Placeholder.configure({ placeholder: 'Commencez à écrire ici...' }),
          FileHandler.configure(FileHandler_configure),
          TaskItem
            .extend({
              addNodeView() {
                return VueNodeViewRenderer(TaskItemComponent)
              }
            })
            .configure({
              nested: true,
            }),
          TaskList,
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