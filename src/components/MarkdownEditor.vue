<template>

  <div class="editor-container">

    <textarea
      v-model="content"
      @input="checkForMath"
      placeholder="Commencez à écrire ici..."
      class="prose h-screen p-0 w-full bg-[#FFF8F0] resize-none border rounded"
    ></textarea>

  </div>

</template>

<script setup lang="ts">

import { ref } from 'vue';
import { evaluate } from 'mathjs';

const props = defineProps<{
  content: string
}>();

const content = ref(props.content);

function checkForMath() {
  const regex = /(\d+[+\-*/\d\s().]*?)=(?!\d)/g;
  const originalText = content.value;

  const processedText = originalText.replace(regex, (fullMatch, rawExpr) => {
    try {
      const result = evaluate(rawExpr.trim());

      if (Array.isArray(result) || typeof result !== 'number') {
        return fullMatch;
      }

      return `${rawExpr.trim()}=${result}`;
    } catch (e) {
      return fullMatch;
    }
  });

  content.value = processedText;
}



</script>

<style scoped>

@import '../assets/css/basic.css';

.editor-container {
  width: 90%;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
}

.editor-container textarea {
  overflow-y: hidden;
  border: none;
  outline: none;
  box-shadow: none;
  font-family: system-ui, sans-serif;
  background-color: #FFF8F0;
}

</style>
