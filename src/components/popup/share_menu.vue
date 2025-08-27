<template>

  <teleport to="body">

    <Danger
      v-if="if_error"
      :value="error_content"
    />

    <Success
      v-if="if_success"
      :value="success_content"
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

          <li @click="share('silver')">
            <img
              class="icon-button w-7.5 h-7.5"
              style="filter: invert(55%) sepia(79%) saturate(558%) hue-rotate(342deg) brightness(93%) contrast(89%);"
              :src="share_svg"
            />
          </li>

        </ul>
      
      </div>
    
    </div>


    <div
      v-if="share_dialogue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >

      <div
        class="bg-[var(--bg2)] rounded-2xl shadow-xl p-6 m-4 w-full max-w-md text-sm border border-gray-300 dark:border-zinc-700"
      >

        <h2 class="text-xl font-bold mb-4">
          Faire un partage
        </h2>

        <div class="flex flex-col gap-5">

          <div class="flex flex-row justify-between gap-5">

            <div>

              <label class="block text-base font-medium ">
                Expire dans :
              </label>

              <div class="flex gap-4 mt-2">

                <div class="flex items-center gap-1">

                  <input
                    v-model="h"
                    type="number"
                    max="24"
                    class="w-14 rounded-lg border border-[var(--btn)] bg-white px-2 py-1 text-center shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-[var(--btn)]
                          dark:bg-zinc-900 dark:border-zinc-700 text-white"
                  />
                  <span class="">h</span>

                </div>

                <div class="flex items-center gap-1">

                  <input
                    v-model="mn"
                    type="number"
                    max="60"
                    class="w-14 rounded-lg border border-[var(--btn)] px-2 py-1 text-center shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-[var(--btn)]
                          bg-zinc-900 text-white"
                  />
                  <span class="">mn</span>

                </div>

              </div>

            </div>

            
            <div>

              <label class="block text-base font-medium mb-2">
                Autoriser la modification :
              </label>

              <Switch 
                v-model="editable"
              />

            </div>

          </div>

          <div>

            <label class="block text-base font-medium">
              Mot de passe :
            </label>
            <span class="block text-xs">Laisser vide pour désactiver</span>
            <input
              v-model="passwd"
              type="text"
              placeholder="Mot de passe"
              class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-[var(--btn)]
                    dark:bg-zinc-900 dark:border-zinc-700 text-white"
            />

          </div>

          <input
            v-if="share_link !== ''"
            :value="share_link"
            type="url"
            readonly
            class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm
                  focus:outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
          />

        </div>

        <div class="flex justify-between mt-6">

          <button
            v-if="share_link !== ''"
            class="second"
            @click="copy_link"
          >
            Copier
          </button>

          <div class="space-x-3">

            <button
              class="second"
              @click="share_dialogue = false"
            >
              {{ share_link == '' ? 'Annuler' : 'Fermer' }}  
            </button>

            <button
              class="danger primary"
              @click="create_share_link"
            >
              Confirmer
            </button>

          </div>

        </div>

      </div>

    </div>
  
  </teleport>

</template>

<script setup lang="ts">

import { defineProps, ref } from 'vue';

import Danger from '../alert/Danger.vue';
import Success from '../alert/Success.vue';

import utils from '@/assets/ts/utils';

import watsapp_svg from '/assets/svgs/social/watsapp.svg?url';
import x_svg from '@/assets/svgs/social/x.svg?url';
import share_svg from '@/assets/svgs/share.svg?url';
import copy_svg from '/assets/svgs/copy.svg?url';
import { api_url } from '@/assets/ts/backend_link';
import Switch from '../Switch.vue';


const props = defineProps<{
  uuid: string;
  visible: boolean;
  title: string;
  content: string;
}>();

const share_dialogue = ref<boolean>(false);
const share_link = ref<string>('');
const mn = ref<number>(0);
const h = ref<number>(1);
const passwd = ref<string>('');
const editable = ref<boolean>(false);

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

  else if (type === 'silver') {

    share_dialogue.value = true;
    return;

  }

};

const create_share_link = async () => {

    if_error.value = false;
    if_success.value = false;

    const res = await fetch(`${api_url}/api/share`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        note_uuid: props.uuid, 
        parms: { 
          life: (h.value * 60 * 3600 * 100) + (mn.value * 3600 * 100), 
          passwd: passwd.value || undefined,
          editable: editable.value
        } 
      }),
    }).then(res => res.json())

    if (res.error) {
      error_content = res.message;
      if_error.value = true;
      return;
    } 

    share_link.value = `http://localhost:5173/share/${res.share.uuid}`;
    success_content = 'Lien de partage généré.';
    if_success.value = true;

}

const copy_link = () => {
  navigator.clipboard.writeText(share_link.value);
}

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
