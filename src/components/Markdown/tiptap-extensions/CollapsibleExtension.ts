import { Node, mergeAttributes } from '@tiptap/core'
import { InputRule } from '@tiptap/pm/inputrules'
import { EditorState, Transaction, TextSelection } from '@tiptap/pm/state'
import { Node as PMNode } from '@tiptap/pm/model'

export const CollapsibleExtension = Node.create({
  name: 'collapsible',

  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      open: {
        default: true,
        parseHTML: element => element.getAttribute('open') !== null,
        renderHTML: attributes => (attributes.open ? { open: 'open' } : {}),
      },
      title: {
        default: 'Title',
        parseHTML: element => element.querySelector('summary')?.innerHTML || 'Title',
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'details',
        getAttrs: element => ({
          open: element.hasAttribute('open'),
          title: element.querySelector('summary')?.innerHTML || 'Title',
        }),
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    // The rendered structure is <details><summary>{title}</summary><div>{content}</div></details>
    const summary = ['summary', {}, node.attrs.title]
    return ['details', mergeAttributes(HTMLAttributes), summary, ['div', { class: 'content' }, 0]]
  },

  addCommands() {
    return {
      setCollapsible:
        (title: string) =>
        ({ commands, chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: { title },
              content: [{
                type: 'paragraph',
              }],
            })
            .focus()
            .run()
        },

      toggleCollapsible:
        () =>
        ({ state, dispatch }) => {
          // Get the position of the collapsible node directly before the current selection's parent block
          const pos = state.selection.$from.before(1)
          const node = state.doc.nodeAt(pos)

          if (node?.type.name === this.name) {
            const newAttrs = {
              ...node.attrs,
              open: !node.attrs.open,
            }
            dispatch?.(state.tr.setNodeMarkup(pos, undefined, newAttrs))
            return true
          }
          return false
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      // Mod-Alt-c to create a new collapsible block
      'Mod-Alt-c': () => this.editor.commands.setCollapsible('Nouveau bloc'),
      // Mod-Alt-o to toggle the collapsible state of the current block
      'Mod-Alt-o': () => this.editor.commands.toggleCollapsible(),
    }
  },

  addInputRules() {
    return [
      // Input rule to create a collapsible block when typing '> ' at the start of a line
      new InputRule(/^>\s$/, (state: EditorState, match: RegExpMatchArray, start: number, end: number): Transaction | null => {
        
        // 1. Create the new collapsible node, including a paragraph node as its content
        const collapsibleNode: PMNode = state.schema.nodes.collapsible.create(
          { title: 'Titre' },
          state.schema.nodes.paragraph.create()
        )

        // 2. Use a transaction to replace the matched text range [start, end] with the new node
        let tr = state.tr.replaceRangeWith(start, end, collapsibleNode)
        
        // Ensure the transaction resulted in a change
        if (!tr.docChanged) {
          return null
        }

        // --- FIX: Recalculate position and use TextSelection.create() for reliability ---

        // 3. Calculate the new cursor position. 
        // For a wrapper block node (collapsible) containing a single child block (paragraph),
        // the cursor should be inside the paragraph content at position:
        // start (collapsible node) + 1 (collapsible node content start) + 1 (paragraph node content start) = start + 2
        const newPos = start + 2

        // 4. Explicitly set the selection using a TextSelection at the calculated position.
        // Using TextSelection.create is generally more robust for programmatic insertions 
        // than Selection.near in input rules, which should resolve the 'find is not a function' error.
        return tr.setSelection(TextSelection.create(tr.doc, newPos))
                 .scrollIntoView()
      }),
    ]
  },
})
