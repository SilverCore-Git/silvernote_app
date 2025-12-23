import TaskItem from '@tiptap/extension-task-item';
import { InputRule } from '@tiptap/core';
import type { Editor } from '@tiptap/vue-3';

export const createTodoInputExtension = (editor: { value: Editor | null }) => {
  return TaskItem.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^\s*(\[[\sXx]\])\s*$/,
          handler: ({ state, range }) => {
            const { tr } = state;
            tr.deleteRange(range.from, range.to);
            editor.value?.chain().toggleTaskList().run();
          },
        }),
      ];
    },
  });
};
