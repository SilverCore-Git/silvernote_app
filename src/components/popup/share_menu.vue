<template>

  <teleport to="body">

    <Error
      v-if="if_error"
      class="z-50 fixed top-14 ml-2"
      :content="error_content"
    />

    <Success
      v-if="if_success"
      class="z-50 fixed top-14 ml-2"
      :content="success_content"
    />

    <div
      v-if="visible"
      class="fixed right-0 left-0 bottom-0 z-50 flex items-center justify-center px-4"
    >

      <div 
        class="bg-[#FFF8F0] rounded-md p-4 m-3 mb-25 w-full max-w-sm text-sm flex items-center justify-center"
        style="border-radius: 15px; box-shadow: 0 0 10px #3336;"
      >

        <ul class="flex flex-row items-center gap-5">

          <li @click="share('watsapp')">
            <img
              class="icon-button w-10 h-10"
              :src="watsapp_svg"
            />
          </li>

          <li @click="share('x')">
            <img
              class="icon-button w-10 h-10"
              :src="x_svg"
            />
          </li>


          <li @click="share('copy')">
            <img
              class="icon-button w-10 h-10"
              style="filter: invert(55%) sepia(79%) saturate(558%) hue-rotate(342deg) brightness(93%) contrast(89%);"
              :src="copy_svg"
            />
          </li>

        </ul>
      
      </div>
    
    </div>
  
  </teleport>

</template>

<script setup lang="ts">

import { defineProps, ref } from 'vue';

import Error from '../status/error.vue';
import Success from '../status/success.vue';

import utils from '@/assets/ts/utils';

import watsapp_svg from '/assets/svgs/social/watsapp.svg?url';
import x_svg from '@/assets/svgs/social/x.svg?url';
import copy_svg from '/assets/svgs/copy.svg?url';


const props = defineProps<{
  visible: boolean
  title: string
  content: string
}>();

const if_error = ref<boolean>(false);
let error_content: string = '';

const if_success = ref<boolean>(false);
let success_content: string = '';

const triggerStatus = (type: string, content: string) => {

  if (type == "error") {
    error_content = content;
    if_error.value = true;
    setTimeout(() => {
      if_error.value = false;
    }, 3000);
  }

  else if (type == 'success') {
    success_content = content;
    if_success.value = true;
    setTimeout(() => {
      if_success.value = false;
    }, 3000);
  }

};

const share = async (type: string): Promise<void> => {

  console.log('Partage d\'une note par', type);

  if (type === 'watsapp') {

    const text = encodeURIComponent(
      `Je te partage ma note : ${await utils.htmlToText(props.title)}
\n
${await utils.htmlToText(props.content)}
\n
Envoyé via www.silvernote.fr`
    );

    const fullUrl = `https://wa.me/?text=${text}`;
    window.open(fullUrl, '_blank');

  }

  else if (type === 'x') {

    const text = encodeURIComponent(
      `${await utils.htmlToText(props.title)}
\n
${await utils.htmlToText(props.content)}
\n
Envoyé via www.silvernote.fr`
    );

    const fullUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(fullUrl, '_blank');

  }

  else if (type === 'copy') {

    try {

      await navigator.clipboard.writeText(`${props.title}\n\n${props.content}`);
      console.log('Contenu copié');
      triggerStatus('success', 'Note copier.');

    } catch (err) {

      console.error('Erreur lors de la copie :', err);
      triggerStatus('error', 'Une erreur est survenue lors de la copie.');

    }
  }
};

</script>

<style scoped>

.icon-button {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  border: none;
  background-color: transparent;
  padding: 0;
}

</style>
