import { getSchema } from '@tiptap/core';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import { CharacterCount, UndoRedo } from '@tiptap/extensions';
import Youtube from '@tiptap/extension-youtube';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Markdown } from 'tiptap-markdown'; 
import FileHandler from '@tiptap/extension-file-handler';

import { noteBtnLink } from '../tiptap-extensions/noteBtnLink';
import SlashCommand from '@/components/Markdown/tiptap-extensions/SlachCommand.js';
import { handleImageUpload, MAX_FILE_SIZE, imageUploadNode } from '../tiptap-extensions/image-upload-node/';
import DragHandle from '../tiptap-extensions/dragHandle';
import FileHandler_configure from '../tiptap-extensions/FileHandler_configure.js';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Table, TableCell, TableRow, TableHeader } from '@tiptap/extension-table';
import { SearchAndReplace } from '../tiptap-extensions/searchAndReplace';
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji';
import { createMathExtension } from '../tiptap-extensions/mathExtension';

import lowlight from '../utils/lowlight.js';
import CodeBlockLowlightComponent from '../tiptap-extensions/components/CodeBlockLowlightComponent.vue';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import suggestion from '../tiptap-extensions/Emoji/suggestions.js';
import ImageComponent from '../tiptap-extensions/components/ImageComponent.vue';


export const schema = getSchema([
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
    Emoji.configure({
      emojis: gitHubEmojis,
      enableEmoticons: true,
      suggestion: suggestion,
    }),
    noteBtnLink,
    Blockquote,
    SlashCommand,
    SearchAndReplace,
    Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
    Underline,
    Image
      .extend({
        selectable: false,
        addNodeView() {
          return VueNodeViewRenderer(ImageComponent)
        }
      })
      .configure({ inline: false, allowBase64: true }),
    Youtube.configure({ HTMLAttributes: { class: 'ytb-viewer' } }),
    UndoRedo,
    CodeBlockLowlight
      .extend({
        addNodeView() {
          return VueNodeViewRenderer(CodeBlockLowlightComponent)
        }
      })
      .configure({
        lowlight,
      }),
    Color,
    imageUploadNode.configure({
      accept: 'image/*',
      maxSize: MAX_FILE_SIZE,
      limit: 3,
      upload: handleImageUpload,
      onError: (error: any) => console.error('Upload failed:', error),
    }),
    TextStyle,
    Highlight.configure({
      multicolor: true,
    }),
    CharacterCount,
    Table,
    TableCell,
    TableRow,
    TableHeader,
    Markdown.configure({ html: true }),
    Placeholder.configure({ placeholder: 'Commencez à écrire ici...' }),
    FileHandler.configure(FileHandler_configure),
    TaskItem.configure({
      nested: true,
    }),
    TaskList,
    createMathExtension(),
  ].concat(DragHandle as any)
);