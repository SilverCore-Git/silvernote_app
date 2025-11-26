// SelectionRectangle.ts
import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const SelectionRectangle = Extension.create({
  name: 'selectionRectangle',

  addProseMirrorPlugins() {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let active = false;
    let decoSet: DecorationSet = DecorationSet.empty;

    const createDecoration = () => {
      if (!active) return DecorationSet.empty;

      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      const div = document.createElement('div');
      div.className = 'selection-rectangle';
      div.style.position = 'absolute';
      div.style.left = `${left}px`;
      div.style.top = `${top}px`;
      div.style.width = `${width}px`;
      div.style.height = `${height}px`;
      div.style.border = '2px dashed var(--btn)';
      div.style.backgroundColor = 'rgba(255, 116, 51, 0.2)';
      div.style.pointerEvents = 'none';
      div.style.zIndex = '9999';

      return DecorationSet.create(
        this.editor.state.doc,
        [Decoration.widget(0, div)]
      );
    };

    return [
      new Plugin({
        props: {
          decorations: () => decoSet,
        },
        view: () => ({
          update: () => {},
        }),
      }),
      new Plugin({
        props: {
          handleDOMEvents: {
            mousedown: (view, event) => {
                console.log(view);
              if (event.button !== 0) return false; // clic gauche seulement
              active = true;
              startX = event.clientX;
              startY = event.clientY;
              currentX = startX;
              currentY = startY;
              document.addEventListener('mousemove', mousemove);
              document.addEventListener('mouseup', mouseup);
              return true;
            },
          },
        },
      }),
    ];

    function mousemove(e: MouseEvent) {
      currentX = e.clientX;
      currentY = e.clientY;
      decoSet = createDecoration();
    }

    function mouseup() {
      active = false;
      decoSet = DecorationSet.empty;
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    }
  },
});
