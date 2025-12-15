<template>

  <div
    :class="[
      ' break-normal p-4 rounded-2xl',
      isMobile ? '' : 'max-w-[85%]',
      origin === 'ai' ? 'ai-message' : origin === 'error' ? 'error-message' : 'user-message'
    ]"
    style="animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);"
  >

    <div v-if="props.origin === 'ai'" class="ai-content space-y-4">

      <div class="timeline flex flex-col gap-2">

        <TransitionGroup name="list">

          <div v-for="(item, index) in timelineItems" :key="`timeline-${index}`" class="timeline-item">
            
            <div 
              v-if="item.type === 'text'" 
              class="ai-text markdown-body leading-relaxed max-w-[75%]"
            >
              <div v-html="item.content"></div>
            </div>

            <div v-else-if="item.type === 'tool'" class="tool-item my-2">
              <div 
                class="tool-toggle flex items-center gap-2 cursor-pointer font-bold select-none" 
                @click="item.isOpen = !item.isOpen"
              >
                <i :class="['bi transition-transform duration-200', item.isOpen ? 'bi-chevron-down' : 'bi-chevron-right']"></i>
                <span class="text-sm">
                  {{ item.status === 'loading' ? 'Exécution en cours...' : `${item.results?.length || 0} étapes exécutées` }}
                </span>
                <span v-if="item.status === 'loading'" class="flex h-2 w-2 relative ml-1">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </div>

              <Transition name="expand">
                <div v-if="item.isOpen" class="tool-details ml-6 mt-2 text-sm border-l-2 pl-3">

                  <!-- <div v-if="item.toolNames?.length" class="mb-1 text-xs uppercase tracking-wider opacity-70">
                    Actions : {{ item.toolNames.join(', ') }}
                  </div> -->

                  <div v-for="(res, i) in item.results" :key="i" class="tool-result italic mb-1">
                    <i class="bi bi-check2 text-green-600 mr-1"></i> {{ res }}
                  </div>

                  <div v-if="item.status === 'loading'" class="loading-bar mt-2">
                    <div class="loading-progress"></div>
                  </div>
                </div>
              </Transition>
            </div>

          </div>
        </TransitionGroup>
      </div>

      <div v-if="isTyping" class="typing-wrapper flex items-center gap-2 mt-2">
        <div class="typing-indicator">
          <span v-for="i in 3" :key="i"></span>
        </div>
        <span class="typing-text text-sm font-medium">SilverIA réfléchit...</span>
      </div>
    </div>

    <div v-else-if="props.origin === 'user'" class="user-content text-sm">
      {{ props.text }}
    </div>

    <div v-else class="error-content flex items-start gap-3">
      <div class="text-xl">⚠️</div>
      <div>
        <div class="font-bold text-sm">Erreur</div>
        <div class="text-xs opacity-90">{{ props.text.replace('[GoogleGenerativeAI Error]', '') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { marked } from 'marked';
import isMobile from '@/assets/ts/utils/isMobile';

const _props = defineProps<{ origin: 'ai' | 'user' | 'error'; text: string }>();
const props = ref({ origin: _props.origin, text: _props.text });
watch(_props, () => { props.value = _props }, { deep: true });

interface TimelineItem {
  type: 'text' | 'tool';
  content?: string;
  toolNames?: string[];
  results?: string[];
  status?: 'loading' | 'success';
  isOpen?: boolean;
}

const timelineItems = ref<TimelineItem[]>([]);
const isTyping = ref<boolean>(true);

const emit = defineEmits<{ (e: 'scroll-to-bottom'): void }>();

marked.setOptions({ breaks: true, gfm: true });

watch(() => props.value.text, (newText) => {
  parseStream(newText);
}, { immediate: true });

function parseStream(fullText: string) {
  const items: TimelineItem[] = [];
  // Regex qui capture les outils, les résultats, et le tag de fin
  const regex = /(\[TOOLS:[^\]]+\]|\[TOOL_RESULT:[^\]]+\]|\[DONE\])/g;
  
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(fullText)) !== null) {
    // 1. Texte avant le tag
    const textSegment = fullText.slice(lastIndex, match.index).trim();
    if (textSegment) {
      items.push({ 
        type: 'text', 
        content: marked.parse(textSegment) as string 
      });
    }

    const token = match[0];

    // 2. Gestion des tags
    if (token.startsWith('[TOOLS:')) {
      const names = token.replace('[TOOLS:', '').replace(']', '').split(',');
      items.push({
        type: 'tool',
        toolNames: names,
        results: [],
        status: 'loading',
        isOpen: false
      });
    } 
    else if (token.startsWith('[TOOL_RESULT:')) {
      const resultText = token.replace('[TOOL_RESULT:', '').replace(']', '');
      // Ajout au dernier tool trouvé
      const lastTool = items.filter(i => i.type === 'tool').pop();
      if (lastTool) {
        lastTool.results?.push(resultText);
      }
    }
    else if (token === '[DONE]') {
      isTyping.value = false;
    }

    lastIndex = regex.lastIndex;
  }

  // 3. Texte restant après le dernier tag
  const remainingText = fullText.slice(lastIndex).trim();
  if (remainingText) {
    items.push({ 
      type: 'text', 
      content: marked.parse(remainingText) as string 
    });
  }

  // Mise à jour des statuts : tout ce qui n'est pas le dernier élément est considéré comme fini
  items.forEach((item, idx) => {
    if (item.type === 'tool') {
      const isLastItem = idx === items.length - 1;
      item.status = isLastItem && isTyping.value ? 'loading' : 'success';
    }
  });

  timelineItems.value = items;
  isTyping.value = !fullText.includes('[DONE]');
  nextTick(() => emit('scroll-to-bottom'));
}
</script>

<style scoped>
@import './MessageDubble.css';
</style>