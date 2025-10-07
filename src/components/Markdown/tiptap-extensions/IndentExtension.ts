import { Extension } from '@tiptap/core'

export const IndentExtension = Extension.create({
  name: 'indent',

  addOptions() {
    return {
      maxLevel: 8,      // niveau d'indent max
      indentSize: 24,   // taille du retrait
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          indent: {
            default: 0,
            renderHTML: attributes => {
              const indent = attributes.indent || 0
              if (indent <= 0) return {}
              return {
                style: `margin-left: ${indent * this.options.indentSize}px;`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ chain, editor }) => {
          const { indent = 0 } = editor.getAttributes('paragraph')
          if (indent < this.options.maxLevel) {
            return chain().updateAttributes('paragraph', { indent: indent + 1 }).run()
          }
          return false
        },

      outdent:
        () =>
        ({ chain, editor }) => {
          const { indent = 0 } = editor.getAttributes('paragraph')
          if (indent > 0) {
            return chain().updateAttributes('paragraph', { indent: indent - 1 }).run()
          }
          return false
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      'Shift-Tab': () => this.editor.commands.outdent(),

      Backspace: () => {
        const { state } = this.editor
        const { selection } = state
        const { $from } = selection

        // Si le curseur est au tout début du paragraphe
        if ($from.parentOffset === 0) {
          const indent = this.editor.getAttributes('paragraph').indent || 0
          if (indent > 0) {
            this.editor.commands.outdent()
            return true
          }
        }
        return false
      },
    }
  },
})
