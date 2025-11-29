<template>

  <SearchANote
    v-if="search"
    @close="search = false"
    @note="openNote"
  />

  <div
    class=" 
            bg-[var(--bg2)] text-[var(--text)] 
            border rounded-xl
            w-full flex flex-col py-2 px-3
    "
    style="box-shadow: 0 0 5px #3636364f;"
    
  >

    <div class="flex flex-row justify-center items-center">

      <button class="search-btn absolute left-0"></button>

      <input 
        ref="search_input"
        type="text"
        class="w-full border-none outline-none text-md ml-2" 
        placeholder="Recherche..."
        @click="search = true"
      >

    </div>

  </div>

</template>



<script lang="ts" setup>

import { ref } from 'vue';

import SearchANote from '@/components/searchANote/searchANote.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const search = ref<boolean>(false);

const openNote = (id: number) => {
  router.push('/edit/' + id);
  search.value = false;
}

</script>

<style scoped>

    .search-btn {

        cursor: pointer;
        width: 20px;
        height: 20px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../assets/svgs/magnifying-glass.svg');
        filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
        transition: all 0.3s ease;

    }

    .cross-btn {

        cursor: pointer;
        width: 25px;
        height: 25px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../assets/svgs/cross.svg');
        filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
        transition: all 0.3s ease;

    }

</style>