import { Extension } from '@tiptap/core';
import { evaluate } from 'mathjs';
import type { Editor } from '@tiptap/vue-3';

const MATH_REGEX = /(\d+(?:\s*[\+\-\*\/]\s*\d+)+)\s*=(?!\d)/g;
const DEBOUNCE_DELAY = 300;

let lastCheckTime = 0;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const evaluatedCache = new Map<string, number>();

export const createMathExtension = () => {
  return Extension.create({
    name: 'mathEvalShortcut',
    addKeyboardShortcuts() {
      return {
        'Mod-Enter': () => {
          if (this.editor) checkForMath(this.editor as any);
          return true;
        },
      };
    },
  });
};

export const createMathCheckDebounced = () => {
  return (editor: Editor) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      checkForMath(editor);
    }, DEBOUNCE_DELAY);
  };
};

function checkForMath(editor: Editor) {
  if (!editor || Date.now() - lastCheckTime < DEBOUNCE_DELAY) return;

  lastCheckTime = Date.now();
  const state = editor.state;
  let tr = state.tr;
  let hasChanges = false;

  state.doc.descendants((node, pos) => {
    if (!node.isText) return true;
    const text = node.text ?? '';
    let match;

    // Reset regex lastIndex
    MATH_REGEX.lastIndex = 0;

    while ((match = MATH_REGEX.exec(text)) !== null) {
      const rawExpr = match[1].trim();
      const fullMatch = match[0];

      try {
        let result: number;

        if (evaluatedCache.has(rawExpr)) {
          result = evaluatedCache.get(rawExpr)!;
        } else {
          result = evaluate(rawExpr) as number;
          evaluatedCache.set(rawExpr, result);
        }

        const evaluated = `${rawExpr}=${result}`;

        if (text.includes(evaluated)) continue;

        const from = pos + match.index;
        const to = from + fullMatch.length;
        tr = tr.insertText(evaluated, from, to);
        hasChanges = true;
      } catch (e) {
        console.warn(`Failed to evaluate "${rawExpr}"`, e);
      }
    }
    return true;
  });

  if (hasChanges && tr.docChanged) {
    editor.view.dispatch(tr as any);
  }
}

// Cleanup on unmount
export const clearMathCache = () => {
  evaluatedCache.clear();
  if (debounceTimer) clearTimeout(debounceTimer);
};
