import { Node, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

// Extension Table
export const Table = Node.create({
  name: 'table',
  content: 'tableRow+',
  tableRole: 'table',
  isolating: true,
  group: 'block',
  
  parseHTML() {
    return [{ tag: 'table' }];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'table-container' }, 
      ['div', { class: 'table-wrapper' }, 
        ['table', mergeAttributes(HTMLAttributes, { class: 'tiptap-table' }), ['tbody', 0]]
      ]
    ];
  },
  
  addCommands() {
    return {
      insertTable: ({ rows = 3, cols = 3 }: { rows: number, cols: number }) => ({ commands }) => {
        const table = {
          type: this.name,
          content: Array.from({ length: rows }, () => ({
            type: 'tableRow',
            content: Array.from({ length: cols }, () => ({
              type: 'tableCell',
              content: [{ type: 'paragraph' }],
            })),
          })),
        };
        return commands.insertContent(table);
      },
      
      deleteTable: () => ({ tr, dispatch }) => {
        const { $anchor } = tr.selection;
        let tablePos = null;
        
        for (let d = $anchor.depth; d > 0; d--) {
          if ($anchor.node(d).type.name === 'table') {
            tablePos = $anchor.before(d);
            break;
          }
        }
        
        if (tablePos !== null && dispatch) {
          const table = tr.doc.nodeAt(tablePos);
          if (table) {
            tr.delete(tablePos, tablePos + table.nodeSize);
            dispatch(tr);
            return true;
          }
        }
        return false;
      },
    };
  },
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('tableControls'),
        props: {
          decorations(state) {
            const { doc, selection } = state;
            const decorations = [];
            const { $anchor } = selection;
            
            for (let d = $anchor.depth; d > 0; d--) {
              if ($anchor.node(d).type.name === 'table') {
                const tablePos = $anchor.before(d);
                decorations.push(
                  Decoration.node(tablePos, tablePos + $anchor.node(d).nodeSize, {
                    class: 'table-active',
                  })
                );
                break;
              }
            }
            
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
      new Plugin({
        key: new PluginKey('tableButtons'),
        view(editorView) {
          const addColumnBtn = document.createElement('div');
          addColumnBtn.className = 'table-add-column-btn';
          addColumnBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/></svg>`;
          addColumnBtn.title = 'Ajouter une colonne';
          
          const addRowBtn = document.createElement('div');
          addRowBtn.className = 'table-add-row-btn';
          addRowBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/></svg>`;
          addRowBtn.title = 'Ajouter une ligne';
          
          document.body.appendChild(addColumnBtn);
          document.body.appendChild(addRowBtn);
          
          let currentTable = null;
          
          const updateButtonPositions = () => {
            const { state } = editorView;
            const { $anchor } = state.selection;
            let tableNode = null;
            let tablePos = null;
            
            for (let d = $anchor.depth; d > 0; d--) {
              if ($anchor.node(d).type.name === 'table') {
                tableNode = $anchor.node(d);
                tablePos = $anchor.before(d);
                break;
              }
            }
            
            if (tableNode && tablePos !== null) {
              const tableDom = editorView.nodeDOM(tablePos);
              const tableWrapper = tableDom?.querySelector?.('.table-wrapper') || tableDom?.closest?.('.table-wrapper');
              const tableContainer = tableDom?.querySelector?.('.table-container') || tableDom?.closest?.('.table-container');
              
              if (tableWrapper && tableContainer) {
                currentTable = tableWrapper;
                const containerRect = tableContainer.getBoundingClientRect();
                
                // Bouton colonne à droite - hauteur du tableau
                addColumnBtn.style.left = `${containerRect.right + 4}px`;
                addColumnBtn.style.top = `${containerRect.top + window.scrollY}px`;
                addColumnBtn.style.height = `${containerRect.height}px`;
                addColumnBtn.style.display = 'flex';
                
                // Bouton ligne en bas - largeur du container
                addRowBtn.style.left = `${containerRect.left}px`;
                addRowBtn.style.top = `${containerRect.bottom + window.scrollY + 4}px`;
                addRowBtn.style.width = `${containerRect.width}px`;
                addRowBtn.style.display = 'flex';
              } else {
                addColumnBtn.style.display = 'none';
                addRowBtn.style.display = 'none';
                currentTable = null;
              }
            } else {
              addColumnBtn.style.display = 'none';
              addRowBtn.style.display = 'none';
              currentTable = null;
            }
          };
          
          addColumnBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const { state, dispatch } = editorView;
            const { $anchor } = state.selection;
            
            for (let d = $anchor.depth; d > 0; d--) {
              if ($anchor.node(d).type.name === 'table') {
                editorView.focus();
                
                let tableDepth = null;
                let cellIndex = 0;
                
                for (let depth = $anchor.depth; depth > 0; depth--) {
                  if ($anchor.node(depth).type.name === 'table') {
                    tableDepth = depth;
                    break;
                  }
                  if ($anchor.node(depth).type.name === 'tableRow') {
                    cellIndex = $anchor.index(depth);
                  }
                }
                
                if (tableDepth === null) return;
                
                const table = $anchor.node(tableDepth);
                const tablePos = $anchor.before(tableDepth);
                let tr = state.tr;
                let offset = 1;
                
                table.forEach((row) => {
                  if (row.type.name === 'tableRow') {
                    let cellPos = tablePos + offset;
                    for (let i = 0; i <= cellIndex; i++) {
                      cellPos += row.child(i).nodeSize;
                    }
                    const newCell = state.schema.nodes.tableCell.create(null, [
                      state.schema.nodes.paragraph.create(),
                    ]);
                    tr = tr.insert(cellPos, newCell);
                  }
                  offset += row.nodeSize;
                });
                
                dispatch(tr);
                break;
              }
            }
          });
          
          addRowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const { state, dispatch } = editorView;
            const { $anchor } = state.selection;
            
            for (let d = $anchor.depth; d > 0; d--) {
              if ($anchor.node(d).type.name === 'tableRow') {
                editorView.focus();
                
                const row = $anchor.node(d);
                const newRow = state.schema.nodeFromJSON({
                  type: 'tableRow',
                  content: Array.from({ length: row.childCount }, () => ({
                    type: 'tableCell',
                    content: [{ type: 'paragraph' }],
                  })),
                });
                
                const pos = $anchor.after(d);
                const tr = state.tr.insert(pos, newRow);
                dispatch(tr);
                break;
              }
            }
          });
          
          editorView.dom.addEventListener('mouseenter', updateButtonPositions, true);
          editorView.dom.addEventListener('mousemove', updateButtonPositions, true);
          
          return {
            update(_view) {
              updateButtonPositions();
            },
            destroy() {
              addColumnBtn.remove();
              addRowBtn.remove();
            }
          };
        }
      })
    ];
  },
});

// Extension TableRow
export const TableRow = Node.create({
  name: 'tableRow',
  content: 'tableCell+',
  tableRole: 'row',
  
  parseHTML() {
    return [{ tag: 'tr' }];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['tr', mergeAttributes(HTMLAttributes), 0];
  },
  
  addCommands() {
    return {
      addRowBefore: () => ({ tr, dispatch, state }) => {
        const { $anchor } = state.selection;
        let rowDepth = null;
        
        for (let d = $anchor.depth; d > 0; d--) {
          if ($anchor.node(d).type.name === 'tableRow') {
            rowDepth = d;
            break;
          }
        }
        
        if (rowDepth === null) return false;
        
        const row = $anchor.node(rowDepth);
        const newRow = state.schema.nodeFromJSON({
          type: 'tableRow',
          content: Array.from({ length: row.childCount }, () => ({
            type: 'tableCell',
            content: [{ type: 'paragraph' }],
          })),
        });
        
        const pos = $anchor.before(rowDepth);
        if (dispatch) {
          tr.insert(pos, newRow);
          dispatch(tr);
        }
        return true;
      },
      
      addRowAfter: () => ({ tr, dispatch, state }) => {
        const { $anchor } = state.selection;
        let rowDepth = null;
        
        for (let d = $anchor.depth; d > 0; d--) {
          if ($anchor.node(d).type.name === 'tableRow') {
            rowDepth = d;
            break;
          }
        }
        
        if (rowDepth === null) return false;
        
        const row = $anchor.node(rowDepth);
        const newRow = state.schema.nodeFromJSON({
          type: 'tableRow',
          content: Array.from({ length: row.childCount }, () => ({
            type: 'tableCell',
            content: [{ type: 'paragraph' }],
          })),
        });
        
        const pos = $anchor.after(rowDepth);
        if (dispatch) {
          tr.insert(pos, newRow);
          dispatch(tr);
        }
        return true;
      },
      
      deleteRow: () => ({ tr, dispatch, state }) => {
        const { $anchor } = state.selection;
        let rowDepth = null;
        
        for (let d = $anchor.depth; d > 0; d--) {
          if ($anchor.node(d).type.name === 'tableRow') {
            rowDepth = d;
            break;
          }
        }
        
        if (rowDepth === null) return false;
        
        const pos = $anchor.before(rowDepth);
        const row = $anchor.node(rowDepth);
        
        if (dispatch) {
          tr.delete(pos, pos + row.nodeSize);
          dispatch(tr);
        }
        return true;
      },
    };
  },
});

// Extension TableCell
export const TableCell = Node.create({
  name: 'tableCell',
  content: 'block+',
  tableRole: 'cell',
  isolating: true,
  
  parseHTML() {
    return [{ tag: 'td' }];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['td', mergeAttributes(HTMLAttributes), 0];
  },
  
  addCommands() {
    return {
      addColumnBefore: () => ({ tr, dispatch, state }) => {
        const { $anchor } = state.selection;
        let tableDepth = null;
        let cellIndex = 0;
        
        for (let d = $anchor.depth; d > 0; d--) {
          if ($anchor.node(d).type.name === 'table') {
            tableDepth = d;
            break;
          }
          if ($anchor.node(d).type.name === 'tableRow') {
            cellIndex = $anchor.index(d);
          }
        }
        
        if (tableDepth === null) return false;
        
        const table = $anchor.node(tableDepth);
        const tablePos = $anchor.before(tableDepth);
        
        if (dispatch) {
          let offset = 1;
          table.forEach((row) => {
            if (row.type.name === 'tableRow') {
              let cellPos = tablePos + offset;
              for (let i = 0; i < cellIndex; i++) {
                cellPos += row.child(i).nodeSize;
              }
              const newCell = state.schema.nodes.tableCell.create(null, [
                state.schema.nodes.paragraph.create(),
              ]);
              tr.insert(cellPos, newCell);
            }
            offset += row.nodeSize;
          });
          dispatch(tr);
        }
        return true;
      },
      
      addColumnAfter: () => ({ tr, dispatch, state }) => {
        const { $anchor } = state.selection;
        let tableDepth = null;
        let cellIndex = 0;
        
        for (let d = $anchor.depth; d > 0; d--) {
          if ($anchor.node(d).type.name === 'table') {
            tableDepth = d;
            break;
          }
          if ($anchor.node(d).type.name === 'tableRow') {
            cellIndex = $anchor.index(d);
          }
        }
        
        if (tableDepth === null) return false;
        
        const table = $anchor.node(tableDepth);
        const tablePos = $anchor.before(tableDepth);
        
        if (dispatch) {
          let offset = 1;
          table.forEach((row) => {
            if (row.type.name === 'tableRow') {
              let cellPos = tablePos + offset;
              for (let i = 0; i <= cellIndex; i++) {
                cellPos += row.child(i).nodeSize;
              }
              const newCell = state.schema.nodes.tableCell.create(null, [
                state.schema.nodes.paragraph.create(),
              ]);
              tr.insert(cellPos, newCell);
            }
            offset += row.nodeSize;
          });
          dispatch(tr);
        }
        return true;
      },
      
      deleteColumn: () => ({ tr, dispatch, state }) => {
        const { $anchor } = state.selection;
        let tableDepth = null;
        let cellIndex = 0;
        
        for (let d = $anchor.depth; d > 0; d--) {
          if ($anchor.node(d).type.name === 'table') {
            tableDepth = d;
            break;
          }
          if ($anchor.node(d).type.name === 'tableRow') {
            cellIndex = $anchor.index(d);
          }
        }
        
        if (tableDepth === null) return false;
        
        const table = $anchor.node(tableDepth);
        const tablePos = $anchor.before(tableDepth);
        
        if (dispatch) {
          let offset = 1;
          table.forEach((row) => {
            if (row.type.name === 'tableRow') {
              let cellPos = tablePos + offset;
              for (let i = 0; i < cellIndex; i++) {
                cellPos += row.child(i).nodeSize;
              }
              const cell = row.child(cellIndex);
              tr.delete(cellPos, cellPos + cell.nodeSize);
            }
            offset += row.nodeSize;
          });
          dispatch(tr);
        }
        return true;
      },
    };
  },
});