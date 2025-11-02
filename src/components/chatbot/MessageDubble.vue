<template>

  <div 
    :class="[
      ' break-all max-w-[85%] p-4 rounded-2xl',
      annimation,
      origin === 'ai' ? 'ai-message' : origin === 'error' ? 'error-message' : 'user-message max-w-[75%]'
    ]"
    style="animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);"
  >

    <div v-if="origin === 'ai'" class="ai-content">

      <TransitionGroup 
        name="tool-list" 
        tag="div" 
        class="tools-timeline"
      >

        <div 
          v-for="(action, index) in toolActions" 
          :key="`tool-${index}`"
        >

          <div class="tool-card-header">
            <div class="tool-badge" :class="`badge-${action.status}`">
              <i class="badge-icon" :class="getToolIcon(action.status)" />
              <span class="badge-text">{{ 
                formatToolName(action.name) 
              }}</span>
            </div>
            
            <div class="tool-timestamp">
              {{ action.timestamp }}
            </div>
          </div>

          <div class="tool-card-header" v-if="action.result">
            <div class="tool-badge" :class="`badge-${action.status}`">
            <i class="badge-icon" :class="getToolIcon(action.status)" />
              <span class="badge-text">{{ 
                formatToolName(action.result) 
              }}</span>
            </div>
          </div>

          <Transition name="fade">
            <div v-if="action.status === 'loading'" class="loading-bar">
              <div class="loading-progress"></div>
            </div>
          </Transition>
          
        </div>

      </TransitionGroup>

      <div v-if="cleanedText" class="ai-text">
        <div 
          v-for="(chunk, index) in renderedChunks"
          :key="index"
          class="text-chunk"
          v-html="chunk.replace('[DONE]', '').replace('#34', ' ')"
        ></div>
      </div>

      <div v-if="isTyping" class="typing-wrapper">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="typing-text">SilverAI réfléchit...</span>
      </div>
      
    </div>

    <div 
      v-else-if="origin === 'user'" 
      class="user-content"
    >
      <img class="w-6 h-6 rounded-full " :src="user?.imageUrl"></img>
      <div>{{ text }}</div>
    </div>

    <div v-else class="error-content">
      <div class="error-icon">⚠️</div>
      <div class="error-details">
        <div class="error-title">Erreur</div>
        <div class="error-text">{{ text }}</div>
      </div>
    </div>

  </div>

</template>

<script setup lang="ts">

import { ref, watch, nextTick, onMounted } from 'vue';
import { marked } from 'marked';
import { useUser } from '@clerk/vue';

const props = defineProps<{
  origin: 'ai' | 'user' | 'error' | 'tool';
  text: string;
}>();

const emit = defineEmits<{
  (e: 'scroll-to-bottom'): void;
}>();

interface ToolAction {
  name: string;
  status: 'loading' | 'success' | 'error';
  result?: string;
  args?: Record<string, any>;
  timestamp: string;
}

const toolActions = ref<ToolAction[]>([]);
const cleanedText = ref<string>('');
const isTyping = ref<boolean>(false);
const renderedChunks = ref<string[]>([]);
let annimation = ''; 
const { user } = useUser();

function scrollToBottom() {
  nextTick(() => {
    emit('scroll-to-bottom');
  });
}


watch(() => props.text, (newText, oldText) => {

  if (props.origin !== 'ai') {
    if (newText !== oldText) {
      scrollToBottom();
    }
    return;
  }

  if (props.text.length < 1) annimation = 'scaleUp';
  if (props.text.length > 0) annimation = '';

  let processedText = newText;
  const newToolActions: ToolAction[] = [...toolActions.value];
  let hasChanges = false;

  // Extraire les appels de tools
  const toolsMatch = processedText.match(/\[TOOLS:(.*?)\]/g);
  if (toolsMatch) {
    toolsMatch.forEach(match => {
      const toolNames = match.replace('[TOOLS:', '').replace(']', '').split(',');
      toolNames.forEach(name => {
        if (name.trim() && !newToolActions.find(a => a.name === name.trim())) {
          newToolActions.push({
            name: name.trim(),
            status: 'loading',
            timestamp: new Date().toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
          });
          hasChanges = true;
        }
      });
      processedText = processedText.replace(match, '');
    });
  }

  // Extraire les résultats
  const resultsMatch = processedText.match(/\[TOOL_RESULT:(.*?)\]/g);
  if (resultsMatch) {
    let resultIndex = 0;
    resultsMatch.forEach(match => {
      const result = match.replace('[TOOL_RESULT:', '').replace(']', '');
      
      // Trouver le prochain tool en loading
      for (let i = resultIndex; i < newToolActions.length; i++) {
        if (newToolActions[i].status === 'loading') {
          newToolActions[i].status = 'success';
          newToolActions[i].result = result;
          resultIndex = i + 1;
          hasChanges = true;
          break;
        }
      }
      
      processedText = processedText.replace(match, '');
    });
  }

  const textChanged = cleanedText.value !== processedText.trim();

  toolActions.value = newToolActions;
  cleanedText.value = processedText.trim();
  
  // Diviser le texte en chunks pour animation
  if (cleanedText.value) {
    const paragraphs = cleanedText.value.split('\n\n');
    renderedChunks.value = paragraphs.map(p => renderMarkdown(p));
  }
  
  isTyping.value = cleanedText.value.length > 0 && 
                   !cleanedText.value.match(/[.!?]$/) &&
                   !cleanedText.value.includes('[DONE]');

  // Scroll si changements
  if (hasChanges || textChanged) {
    scrollToBottom();
  }
}, { immediate: true });

onMounted(() => {
  scrollToBottom();
});

function formatToolName(name: string): string {
  const names: Record<string, string> = {
    'edit_note_content': 'édition de la note',
    'edit_note_title': 'édition du titre',
    'edit_note_icon': 'édition de l\'icône',
  };
  
  return names[name] || name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getToolIcon(status: string): string {
  switch (status) {
    case 'loading': return 'bi bi-hourglass-split text-amber-500';
    case 'success': return 'bi bi-check-circle-fill text-emerald-500';
    case 'error': return 'bi bi-x-circle-fill text-rose-500';
    default: return 'bi bi-wrench-adjustable-circle-fill text-indigo-500';
  }
}

function renderMarkdown(text: string): string {
  if (!text) return '';
  
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  
  return marked.parse(text) as string;
}
</script>

<style lang="css" scoped>
@import './MessageDubble.css';
</style>