import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import Image from '@tiptap/extension-image';
import { CharacterCount, UndoRedo } from '@tiptap/extensions';
import Youtube from '@tiptap/extension-youtube';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Markdown } from 'tiptap-markdown';
import { Collaboration } from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import FileHandler from '@tiptap/extension-file-handler';

import { noteBtnLink } from './tiptap-extensions/noteBtnLink';
import SlashCommand from '@/components/Markdown/tiptap-extensions/SlachCommand.js';
import { IndentExtension } from './tiptap-extensions/IndentExtension.js';
import { handleImageUpload, MAX_FILE_SIZE, imageUploadNode } from './tiptap-extensions/image-upload-node/';
import DragHandle from './tiptap-extensions/dragHandle';
import FileHandler_configure from './tiptap-extensions/FileHandler_configure.js';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Table, TableCell, TableRow, TableHeader } from '@tiptap/extension-table';
import { SearchAndReplace } from './tiptap-extensions/searchAndReplace';
import { createMathExtension } from './tiptap-extensions/mathExtension';
import { createTodoInputExtension } from './tiptap-extensions/todoExtension';

import type * as Y from 'yjs';
import lowlight from './utils/lowlight.js';
import CodeBlockLowlightComponent from './tiptap-extensions/CodeBlockLowlightComponent.vue';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

interface EditorConfigParams {
  editable?: boolean;
  ydoc: Y.Doc;
  provider: any;
  todoInputExtension: ReturnType<typeof createTodoInputExtension>;
  userColor: string;
  userName: string;
  userAvatar: string | undefined;
  onMathCheck: () => void;
}

export function buildEditorExtensions(params: EditorConfigParams) {
  const {
    ydoc,
    provider,
    todoInputExtension,
    userColor,
    userName,
    userAvatar,
  } = params;

  return [
    StarterKit.configure({
      history: false,
      codeBlock: false,
      code: false,
      blockquote: false,
    }),
    TaskList,
    todoInputExtension,
    noteBtnLink,
    Blockquote,
    SlashCommand,
    SearchAndReplace,
    Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
    Underline,
    Image.configure({ inline: false, allowBase64: true }),
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
    IndentExtension,
    Markdown.configure({ html: true }),
    Placeholder.configure({ placeholder: 'Commencez à écrire ici...' }),
    FileHandler.configure(FileHandler_configure),
    Collaboration.configure({
      document: ydoc,
      field: 'prosemirror',
    }),
    CollaborationCaret.configure({
      provider,
      user: {
        name: userName,
        color: userColor,
        avatar: userAvatar,
      },
    }),
    createMathExtension(),
  ].concat(DragHandle as any);
}

export function getEditorConfig(params: EditorConfigParams) {
  return {
    extensions: buildEditorExtensions(params),
    editable: params.editable,
    onUpdate: params.onMathCheck,
  };
}
