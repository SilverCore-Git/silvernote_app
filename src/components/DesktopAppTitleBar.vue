<template>
<header
  class="relative h-10 bg-neutral-900/80 backdrop-blur
         flex items-center justify-between px-3 z-50"
  style="-webkit-app-region: drag"
>
    <div>SilverNote</div>

    <div class="flex gap-2" style="-webkit-app-region: no-drag">
        <button @click="minimize">—</button>
        <button @click="maximize">⬜</button>
        <button @click="close">✕</button>
    </div>
    </header>
</template>

<script lang="ts" setup>


const minimize = () => {
    (window as any).windowControls.minimize()
}
const maximize = () => {
    (window as any).windowControls.maximize()
}
const close = () => {
    (window as any).windowControls.close()
}


</script>