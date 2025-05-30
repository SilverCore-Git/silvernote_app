<template>

  <div
    class="note-card bg-[#FFF8F0] mr-4 ml-4 text-[#3B3B3B] p-3 border-[#3B3B3B] border-2 relative cursor-pointer"
    style="border-radius: 15px;"
  > 

    <p class="font-bold text-xl mb-1 w-[80%] whitespace-nowrap overflow-hidden text-ellipsis
              animate-pulse bg-gray-300 h-5 rounded-full"
    ></p>

    <div
      class="pin absolute right-3 top-3 animate-pulse bg-gray-300 h-5 rounded-full"
    ></div>

    <p 
      class="text-mb mb-5 w-[65%] whitespace-nowrap overflow-hidden text-ellipsis
            animate-pulse bg-gray-300 h-5 rounded-full"
    ></p>

    <div class="
      absolute left-3 bottom-1.5 w-[60%] whitespace-nowrap overflow-x-auto text-ellipsis scrollbar-none
      animate-pulse bg-gray-300 h-5 rounded-full
    "></div>

    <label class="absolute right-2 bottom-1.5 animate-pulse bg-gray-300 h-5 rounded-full w-[20%]"></label>

  </div>

</template>

<script setup lang="ts">

</script>

<style scoped>

.pin {
  width: 25px;
  height: 25px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

</style>
