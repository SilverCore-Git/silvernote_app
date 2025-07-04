<template>

  <a
    :href="linux_props?.is || false ? undefined : downloadLink"
    :target="linux_props?.is || false ? '' : '_blank'"
    @click="linux_props?.is || false ? open_linux_drop = !open_linux_drop : false"
    rel="noopener noreferrer"
    class="flex flex-col items-center p-6 rounded-xl text-center transition-transform duration-200 hover:scale-105"
    :class="cardClasses"
  >

    <div :style="{ backgroundImage: `url(${svgbg})` }" class="svg w-15 h-15 mb-4"></div>

    <h3 class="text-xl text-black font-semibold mb-2">{{ platformName }}</h3>

    <span class="text-sm font-medium" :class="buttonTextClasses">{{ buttonText }}</span>

    <ul class=" mt-3" v-if="(linux_props?.is || false) && open_linux_drop">
      <li>
        <a 
          :href="linux_props.deb"
          class="reset-class cursor-pointer  mr-2">.deb</a>
        <a 
          :href="linux_props.rpm"
          class=" cursor-pointer ">.rpm</a>
      </li>
      <li><a 
          :href="linux_props.appimage"
          class=" cursor-pointer ">.appimage</a></li>
    </ul>

  </a>

</template>

<script setup lang="ts">

import { computed, ref } from 'vue';

const props = defineProps<{
  platform: string;
  platformName: string;
  downloadLink: string | undefined;
  svgbg?: string;
  buttonText?: string;
  linux_props?: { 
		is: boolean, 
		appimage: string | undefined, 
		deb: string | undefined, 
		rpm: string | undefined 
	};
}>();

const open_linux_drop = ref<boolean>(false);

const cardClasses = computed(() => ({
  'bg-[var(--bg2)] text-black border border-transparent hover:border-[var(--btn)]': true, 
}));


const buttonTextClasses = computed(() => ({
  'text-black': true,
}));

const buttonText = computed(() => props.buttonText || 'Télécharger');

</script>

<style lang="css" scoped>

.svg {
  background-repeat: no-repeat;
  background-size: contain; 
  background-position: center center;
}

</style>