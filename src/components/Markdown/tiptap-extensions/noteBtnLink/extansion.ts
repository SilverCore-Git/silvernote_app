import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import type { NoteBtnLinkOptions } from './type';
import NoteBtnLink from './noteBtnLink.vue'


declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    noteBtnLink: {
      setNoteBtnLink: (options: NoteBtnLinkOptions) => ReturnType
    }
  }
}


const NoteBtnLinkExtension = Node.create<NoteBtnLinkOptions>({
    name: 'noteBtnLink',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
        noteId: {
            default: 0,
        },
        }
    },

    parseHTML() {
        return [{ tag: 'note-btn-link' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['note-btn-link', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return VueNodeViewRenderer(NoteBtnLink as any)
    },

    addCommands() {
        return {
        setNoteBtnLink:
            (attrs) =>
            ({ commands }) => {
            return commands.insertContent({
                type: this.name,
                attrs,
            })
            },
        }
    },
})


export { 
    NoteBtnLinkExtension
}