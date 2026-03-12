<template>

  <div class="flex flex-col h-full p-4 md:p-8">

    <h2 class="text-2xl font-bold mb-2">Importez vos notes !</h2>
    <p class="text-(--text)/80">Importez vos notes depuis vos anciens outils.</p>

    <div class="flex flex-col justify-center items-center gap-4 mx-2 my-4 h-full">

      <button
        v-for="src in sources" 
        :key="src.id"
        @click="$emit('toggle', src.id)"
        class="h-full w-full cursor-pointer relative rounded-xl border border-(--text)/10 p-4 transition-all duration-150"
        :class="
          selected.includes(src.id) 
            ? 'bg-(--btn)/5 border-(--btn) ring-1 ring-(--btn)' 
            : 'bg-(--bg)/30'
        "
      >

        <div class="flex items-center gap-3">
          <img :src="src.icon" class="w-10 h-10 object-contain " />
          <span class="text-lg font-bold">{{ src.name }}</span>
        </div>
        
        <transition name="fade-slide">
          <div 
            v-if="selected.includes(src.id)" 
            class="
              absolute top-2 right-2 
              text-(--btn) bg-white 
              rounded-full w-5 h-5 
              flex items-center 
              justify-center text-xs
            "
          >
            <i class="bi bi-check-lg" />
          </div>
        </transition>
      
      </button>

    </div>

  </div>

</template>

<script setup lang="ts">
defineProps<{ 
  selected: string[], 
  sources: any[] 
}>();
</script>