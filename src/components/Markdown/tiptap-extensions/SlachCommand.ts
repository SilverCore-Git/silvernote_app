import { Extension } from '@tiptap/core';
import { VueRenderer } from '@tiptap/vue-3';
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion';
import tippy, { type Instance as TippyInstance } from 'tippy.js';
import mdinputMenu from '../ToolsMenu/mdInputType/mdInputMenu.vue';

export interface SlashCommandOptions {
  suggestion: Omit<SuggestionOptions, 'editor'>;
}

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
        render: () => {
          let component: VueRenderer;
          let popup: TippyInstance | undefined;

          return {
            onStart: (props: any) => {
              component = new VueRenderer(mdinputMenu, {
                props: {
                    show: true,
                    type: 'insert',
                    searchType: 'props',
                    query: 'test'
                },
                
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }


                popup = tippy(document.body, {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element!, // on force HTMLElement
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                    arrow: false,
                });


            },

            onUpdate(props: any) {
              component.updateProps(props);

              if (!props.clientRect || !popup) {
                return;
              }

              popup.setProps({
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown(props: any) {
              if (
                  props.event.key === 'Escape'
                  || props.event.key === 'Tab'
                ) {
                popup?.hide();
                return true;
              }

              if (props.event.key === 'Enter')
              {
                setTimeout(() => {
                  popup?.hide();
                  return true;
                }, 100)
              }

              return component.ref?.onKeyDown?.(props) || false;
            },

            onExit() {
              popup?.destroy();
              component.destroy();
            },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default SlashCommand;