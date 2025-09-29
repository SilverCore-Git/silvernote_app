import { Extension, type Editor } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';

interface ExclaimItem {
  title: string;
}

interface ExclaimOptions {
  items: string[];
}

const SlashCommand = Extension.create<ExclaimOptions>({
    name: 'SlashCommand',

    addOptions() {
        return {
            items: [
                'Titre 1',
                'Titre 2',
                'Titre 3',
                'Titre 4',
                'Paragraphe',
                'Liste à puces',
                'Liste numérotée',
                'Liste de tâches',
                'Citation',
                'Trait de séparation',
                'Code',
            ],
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                char: '/',
                items: ({ query }: { query: string }) => {
                return this.options.items
                    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
                    .map((item) => ({ title: item }));
                },

                command: ({ editor, range, props }: { editor: Editor; range: any; props: ExclaimItem }) => {

                    const commandMapping: Record<string, () => void> = {

                        // Blocs de texte et titres
                        'Titre 1': () => editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run(),
                        'Titre 2': () => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run(),
                        'Titre 3': () => editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run(),
                        'Titre 4': () => editor.chain().focus().deleteRange(range).setNode('heading', { level: 4 }).run(),
                        'Paragraphe': () => editor.chain().focus().deleteRange(range).setNode('paragraph').run(),

                        // Listes
                        'Liste à puces': () => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
                        'Liste numérotée': () => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
                        'Liste de tâches': () => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
                        
                        // Citations et séparations
                        'Citation': () => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
                        'Trait de séparation': () => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
                        'Code': () => editor.chain().focus().deleteRange(range).setCodeBlock().run(),
                        
                    };

                    const command = commandMapping[props.title];
                    if (command) {
                        command();
                    } else {
                        editor.chain().focus().insertContentAt(range, props.title + ' ').run();
                    }
                    },

                    render: () => {
                    let component: HTMLDivElement | null = null;
                    let list: HTMLUListElement | null = null;
                    let activeIndex = 0;
                    let currentItems: ExclaimItem[] = [];
                    let currentCommand: ((item: ExclaimItem) => void) | null = null;

                    const updateList = () => {
                        if (!list || !currentItems || !currentCommand) return;
                            list.innerHTML = '';
                            currentItems.forEach((item, index) => {
                            const li: HTMLLIElement = document.createElement('li');
                            li.className = `cursor-pointer w-full flex items-center gap-3 rounded-lg p-2 font-medium transition-all duration-200 text-[var(--text)] ${
                                index === activeIndex
                                ? 'bg-[var(--btn)] text-white'
                                : 'hover:bg-[var(--btn)] hover:text-white'
                            }`;
                            li.textContent = item.title;
                            li.addEventListener('click', () => {
                                currentCommand!(item);
                            });
                            list?.appendChild(li);
                        });
                    };

                    return {


                        onStart: (props: SuggestionProps<ExclaimItem>) => {
                        component = document.createElement('div');
                        component.className = 'absolute z-50 p-2 rounded-xl bg-[var(--bg2)] border border-[var(--btn)] backdrop-blur-sm shadow-2xl';
                        
                        component.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                        });

                        list = document.createElement('ul');
                        component.appendChild(list);
                        document.body.appendChild(component);

                        const rect = props.clientRect?.();
                            if (rect) {
                                Object.assign(component.style, {
                                left: `${rect.left}px`,
                                top: `${rect.bottom}px`,
                                });
                            }

                            activeIndex = 0;
                            currentItems = props.items;
                            currentCommand = props.command;
                            updateList();
                        },
                        
                        onUpdate: (props: SuggestionProps<ExclaimItem>) => {
                            if (!component) return;
                            currentItems = props.items;
                            currentCommand = props.command;
                            activeIndex = 0;
                            updateList();

                            const rect = props.clientRect?.();
                            if (rect) {
                                Object.assign(component.style, {
                                left: `${rect.left}px`,
                                top: `${rect.bottom}px`,
                                });
                            }
                        },

                        onKeyDown: (props: SuggestionKeyDownProps) => {
                            if (props.event.key === 'ArrowUp') {
                                activeIndex = (activeIndex + currentItems.length - 1) % currentItems.length;
                                updateList();
                                return true;
                            }
                            if (props.event.key === 'ArrowDown') {
                                activeIndex = (activeIndex + 1) % currentItems.length;
                                updateList();
                                return true;
                            }
                            if (props.event.key === 'Enter') {
                                currentCommand!(currentItems[activeIndex]);
                                return true;
                            }
                            if (props.event.key === 'Escape') {
                                props.event.preventDefault();
                                return true;
                            }
                            return false;
                        },

                        onExit: () => {
                            if (component) component.remove();
                            component = null;
                            list = null;
                        },
                    };
                },
            }),
        ];
    },
});

export default SlashCommand;