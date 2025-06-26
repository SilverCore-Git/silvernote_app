<template>
  <component :is="Component" />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { defineAsyncComponent, ref, watch } from 'vue'

const route = useRoute()
const Component = ref<any>(null)

// Composant fallback en cas d'erreur d'import
const ErrorComponent = {
  template: `<div style="color:red">Composant introuvable.</div>`
}

// Fonction qui crée un async component selon le nom donné
const getAsyncComponent = (name: string) =>
  defineAsyncComponent({
    loader: () => import(`../../components/${name}`),
    // Composant à afficher en cas d’erreur
    errorComponent: ErrorComponent,
    // Optionnel : délai avant affichage du loading
    delay: 200,
    // Optionnel : timeout pour l’import
    timeout: 3000,
  })

const loadComponent = () => {
  const name = route.params.component as string | undefined
  if (name) {
    Component.value = getAsyncComponent(name)
  } else {
    Component.value = null
  }
}

// Charge au montage
loadComponent()

// Recharge si param change
watch(() => route.params.component, loadComponent)
</script>
