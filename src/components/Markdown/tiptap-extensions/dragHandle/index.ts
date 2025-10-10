import DragHandle from '@tiptap/extension-drag-handle';
import NodeRange from '@tiptap/extension-node-range';

function createDragIcon(): HTMLElement {
  const icon = document.createElement('div');
  icon.className = 'drag-icon';
  return icon;
}

function onDragIconLoaded(callback: (extensions: any) => void) {
  const check = () => {
    if (typeof Extensions !== 'undefined' && Extensions.length > 0) {
      callback(Extensions);
    } else {
      setTimeout(check, 100);
    }
  };
  check();
}


const Extensions = [
  DragHandle.configure({ 
    computePositionConfig: { 
      placement: 'left-start', 
      strategy: 'absolute' 
    }, 
    render: () => createDragIcon()
  }),
  NodeRange.configure({ key: null }),
]

export default Extensions;
export {
  onDragIconLoaded
}