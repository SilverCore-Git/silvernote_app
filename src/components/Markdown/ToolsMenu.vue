<template>

    <div 
        class="editor-area"
        @contextmenu.prevent="openMenu"
        @click="closeMenu"
    >

        <slot />
        
        <div 
            v-if="showMenu" 
            class="context-menu dropdown overflow-auto"
            :style="{ top: `${posY}px`, left: `${posX}px` }"
            @click="closeMenu"
        >

            <div 
                v-for="cat in categories" 
                :key="cat" 
                class="category-section"
            >

                <h3 v-if="cat">{{ cat }}</h3>

                <ul>

                    <li 
                        v-for="a in getActionsByCategory(cat)"
                        @click.stop="action(a.id)"
                    >
                        {{ a.name }}
                    </li>

                </ul>

            </div>

        </div>

    </div>

</template>

<script setup lang="ts">

import type { Editor } from '@tiptap/vue-3';
import { onMounted, ref } from 'vue'

const props = defineProps<{
    editor?: Editor;
}>();


type ActionSCategories = 'header' | 'text' | 'list' | 'insert' | 'history' | '';

interface Action {
    id: number;
    name: string;
    action: Function;
    categorie?: ActionSCategories;
}

const actions = ref<Action[]>([]);
const categories = ref<ActionSCategories[]>(['header', 'text', 'list', 'insert', 'history']);
const showMenu = ref<boolean> (false)
const posX = ref<number>(0)
const posY = ref<number>(0)

const openMenu =(event: MouseEvent) => {
  event.preventDefault()
  posX.value = event.clientX
  posY.value = event.clientY
  showMenu.value = true
}

const closeMenu = () => {
  showMenu.value = false
}

const action = (id: number) => {
    const a = actions.value.find(a => a.id == id);
    console.log("Action:", a?.name)

    a?.action();

    closeMenu()
}

const newId = (): number => {
    return Math.floor(Math.random() * 1000000);
}

const getActionsByCategory = (cat: ActionSCategories) => {
    return actions.value.filter(a => a.categorie === cat);
};



onMounted(() => {

    actions.value = [

        {
            id: newId(),
            name: 'Gras',
            action: () => props.editor?.chain().focus().toggleBold().run(),
            categorie: 'text'
        },
        {
            id: newId(),
            name: 'Italique',
            action: () => props.editor?.chain().focus().toggleItalic().run(),
            categorie: 'text'
        },
        {
            id: newId(),
            name: 'Souligné',
            action: () => props.editor?.chain().focus().toggleUnderline().run(),
            categorie: 'text'
        },
        {
            id: newId(),
            name: 'Barré',
            action: () => props.editor?.chain().focus().toggleStrike().run(),
            categorie: 'text'
        },
        {
            id: newId(),
            name: 'Code',
            action: () => props.editor?.chain().focus().toggleCode().run(),
            categorie: 'text'
        },
        {
            id: newId(),
            name: 'Citation',
            action: () => props.editor?.chain().focus().toggleBlockquote().run(),
            categorie: 'text'
        },
        {
            id: newId(),
            name: 'Liste à puces',
            action: () => props.editor?.chain().focus().toggleBulletList().run(),
            categorie: 'list'
        },
        {
            id: newId(),
            name: 'Liste numérotée',
            action: () => props.editor?.chain().focus().toggleOrderedList().run(),
            categorie: 'list'
        },
        {
            id: newId(),
            name: 'Tâche (todo)',
            action: () => props.editor?.chain().focus().toggleTaskList().run(),
            categorie: 'list'
        },
        {
            id: newId(),
            name: 'Titre 1',
            action: () => props.editor?.chain().focus().toggleHeading({ level: 1 }).run(),
            categorie: 'header'
        },
        {
            id: newId(),
            name: 'Titre 2',
            action: () => props.editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            categorie: 'header'
        },
        {
            id: newId(),
            name: 'Titre 3',
            action: () => props.editor?.chain().focus().toggleHeading({ level: 3 }).run(),
            categorie: 'header'
        },
        {
            id: newId(),
            name: 'Paragraphe',
            action: () => props.editor?.chain().focus().setParagraph().run(),
            categorie: 'header'
        },
        {
            id: newId(),
            name: 'Séparateur',
            action: () => props.editor?.chain().focus().setHorizontalRule().run(),
            categorie: 'insert'
        },
        {
            id: newId(),
            name: 'Lien',
            action: () => {
                const url = prompt('Entrez un lien :')
                if (url) props.editor?.chain().focus().setLink({ href: url }).run()
            },
            categorie: 'insert'
        },
        {
            id: newId(),
            name: 'Supprimer lien',
            action: () => props.editor?.chain().focus().unsetLink().run(),
            categorie: 'insert'
        },
        {
            id: newId(),
            name: 'Image',
            action: () => {
                const url = prompt('Entrez l’URL de l’image :')
                if (url) props.editor?.chain().focus().setImage({ src: url }).run()
            },
            categorie: 'insert'
        },
        {
            id: newId(),
            name: 'Annuler',
            action: () => props.editor?.chain().focus().undo().run(),
            categorie: 'history'
        },
        {
            id: newId(),
            name: 'Rétablir',
            action: () => props.editor?.chain().focus().redo().run(),
            categorie: 'history'
        }

    ]

})


</script>

<style scoped>

.context-menu {
  position: fixed;
  max-height: 20em;
  z-index: 1000;
  border: 1px solid var(--btn);
}

.category-section {
  margin-bottom: 12px;
}

.category-section h3 {
  font-size: 14px;
  margin: 0 0 8px 0;
}

.category-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-section li {
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
}

.category-section li:hover {
  background: #f5f5f5;
}

</style>
