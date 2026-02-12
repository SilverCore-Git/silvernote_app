import { VueRenderer } from '@tiptap/vue-3'
import tippy, { type Instance, type Props } from 'tippy.js'
import EmojiList from './EmojiList.vue'

type SuggestionKeyDownProps = any;
type SuggestionProps = any;

interface EmojiItem {
  shortcodes: string[]
  tags: string[]
  emoji: string
}

export default {
  items: ({ editor, query }: { editor: any, query: string }): EmojiItem[] => {
    return editor.storage.emoji.emojis
      .filter(({ shortcodes, tags }: EmojiItem) => {
        return (
          shortcodes.find(shortcode => shortcode.startsWith(query.toLowerCase()))
          || tags.find(tag => tag.startsWith(query.toLowerCase()))
        )
      })
      .slice(0, 5)
  },

  render: () => {
    let component: VueRenderer | any
    let popup: Instance<Props>[]

    return {
      onStart: (props: SuggestionProps) => {
        component = new VueRenderer(EmojiList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as any,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props: SuggestionProps) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect as any,
        })
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }

        // On utilise l'optional chaining pour appeler la méthode du composant Vue
        return component.ref?.onKeyDown(props)
      },

      onExit() {
        if (popup && popup[0]) {
          popup[0].destroy()
        }
        if (component) {
          component.destroy()
        }
      },
    }
  },
}