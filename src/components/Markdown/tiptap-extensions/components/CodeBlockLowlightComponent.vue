<template>

    <node-view-wrapper class="code-block">

        <div class="code-block-header" contenteditable="false">
            
            <select 
                v-model="selectedLanguage"
            >

                <option :value="null">Auto</option>
                <option disabled>----</option>
                <option 
                    v-for="(lang, index) in languages" 
                    :key="'lang-' + index" 
                    :value="lang"
                >
                    {{ lang }}
                </option>

            </select>

            <button @click="copyContent" class="default">
                {{ copied ? 'Copié !' : 'Copier' }}
            </button>
            
        </div>

        <pre><code :class="`language-${selectedLanguage}`"><node-view-content /></code></pre>

    </node-view-wrapper>

</template>

<script setup>

import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { ref, computed } from 'vue'

const props = defineProps(nodeViewProps)

const copied = ref(false)

const languages = computed(() => props.extension.options.lowlight.listLanguages())

const selectedLanguage = computed({
    get: () => props.node.attrs.language,
    set: (language) => props.updateAttributes({ language })
})

const copyContent = () => {
    const text = props.node.textContent
    navigator.clipboard.writeText(text).then(() => {
        copied.value = true
        setTimeout(() => { copied.value = false }, 2000)
    })
}

</script>

<style scoped>

@import '../../../../style.css';

.code-block {
    position: relative;
    background: var(--white);
    border-radius: 0.75rem;
    margin: 1.5rem 0;
}

.code-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background: var(--white);
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
    font-family: sans-serif;
}

select {
    background: transparent;
    border: 1px solid #444;
    border-radius: 4px;
    outline: none;
}

</style>