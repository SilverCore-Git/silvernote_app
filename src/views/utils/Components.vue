<template>

    <component :is="Component" />

</template>


<script lang="ts" setup>

import { useRoute } from 'vue-router'
import { defineAsyncComponent, ref, watch } from 'vue'

const route = useRoute()
const Component = ref()

const loadComponent = async () => {
  try {
    const name = route.params.component as string

    Component.value = defineAsyncComponent(() =>
      import(`../../components/${name}`)
    )
  } catch (error) {
    console.error('Composant introuvable :', error)
  }
}


loadComponent()


watch(() => route.params.component, () => {
  loadComponent()
})

</script>