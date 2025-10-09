import DragHandle from '@tiptap/extension-drag-handle';
import NodeRange from '@tiptap/extension-node-range';

function createDragIcon(): HTMLElement {
  const icon = document.createElement('div')
  icon.className = 'drag-icon'
  return icon
}

const Extensions = [
  DragHandle.configure({ 
    computePositionConfig: { 
      placement: 'left-start', 
      strategy: 'fixed' 
    }, 
    render: () => createDragIcon()
  }),
  NodeRange.configure({ key: null }),
]

export default Extensions;