<template>
  <div class="dropdown-menu">
    <button
      v-for="(item, index) in items"
      :key="index"
      :class="{ 'is-selected': index === selectedIndex }"
      @click="selectItem(index)"
    >
      <img v-if="item.fallbackImage" :src="item.fallbackImage" alt="emoji">
      <template v-else>
        {{ item.emoji }}
      </template>
      :{{ item.name }}:
    </button>
    
    <div v-if="!items.length" class="no-result">
      Aucun résultat
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Typage des propriétés
interface EmojiItem {
  name: string
  emoji?: string
  fallbackImage?: string
}

interface Props {
  items: EmojiItem[]
  command: (payload: { name: string }) => void
  editor: any
}

const props = defineProps<Props>()

const selectedIndex = ref(0)

// Reset de l'index quand la recherche change
watch(() => props.items, () => {
  selectedIndex.value = 0
})

// Logique de navigation
const upHandler = () => {
  selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length
}

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

const enterHandler = () => {
  selectItem(selectedIndex.value)
}

const selectItem = (index: number) => {
  const item = props.items[index]
  if (item) {
    props.command({ name: item.name })
  }
}

// La méthode magique appelée par ton fichier Suggestion.ts
const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

// IMPORTANT : On expose la méthode pour que le moteur de suggestion puisse l'utiliser
defineExpose({
  onKeyDown,
})
</script>

<style lang="scss" scoped>
.dropdown-menu {
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 0.7rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  overflow: auto;
  padding: 0.4rem;
  position: relative;
  max-height: 250px;

  button {
    align-items: center;
    background-color: transparent;
    border: none;
    border-radius: 0.4rem;
    display: flex;
    gap: 0.5rem;
    padding: 0.4rem 0.8rem;
    text-align: left;
    width: 100%;
    cursor: pointer;
    color: var(--text);

    &:hover {
      background-color: var(--gray-3);
    }

    &.is-selected {
      background-color: var(--gray-2);
      // Optionnel : utilise ta variable --btn ici si tu veux 
      // background-color: var(--btn);
      // color: white;
    }

    img {
      height: 1.2em;
      width: 1.2em;
    }
  }

  .no-result {
    padding: 0.4rem 0.8rem;
    color: var(--gray-1);
    font-size: 0.9rem;
  }
}
</style>