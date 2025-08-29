<template>
  
  <teleport to="body">

    <Popup v-model:visible="visible" @update:visible="visible = $event">

      <div @click.stop="visible = true">

        <h2 class="text-xl font-bold mb-4">
          Partager : <span class="font-medium">{{ title }}</span>
        </h2>

        <div class="flex flex-col gap-5">
          
          <div class="flex flex-row justify-between gap-5">
            <div>
              <label class="block text-base font-medium">Expire dans :</label>
              <div class="flex gap-4 mt-2">
                <div class="flex items-center gap-1">
                  <input
                    v-model="h"
                    type="number"
                    max="24"
                    class="w-14 rounded-lg bg-white px-2 py-1 text-center shadow-sm
                          focus:outline-none dark:bg-zinc-900 focus:border border-[var(--btn)] text-white"
                  />
                  <span>h</span>
                </div>

                <div class="flex items-center gap-1">
                  <input
                    v-model="mn"
                    type="number"
                    max="60"
                    class="w-14 rounded-lg px-2 py-1 text-center shadow-sm focus:outline-none
                          bg-zinc-900 text-white focus:border border-[var(--btn)]"
                  />
                  <span>mn</span>
                </div>
              </div>
            </div>

            
            <div class="flex justify-center items-center flex-col">
              <label class="block text-base font-medium mb-2">Autoriser la modification :</label>
              <Switch v-model="editable" />
            </div>

          </div>

          
          <div>

            <label class="block text-base font-medium">Mot de passe :</label>
            <span class="block text-xs">Laisser vide pour désactiver</span>

            <input
              v-model="passwd"
              type="text"
              placeholder="Mot de passe"
              class="mt-1 w-full rounded-lg px-3 py-2 shadow-sm
                    focus:outline-none dark:bg-zinc-800 text-white
                    focus:border border-[var(--btn)]"
            />

          </div>
          

          <input
            v-if="share_link !== ''"
            :value="share_link"
            type="url"
            readonly
            class="w-full rounded-lg bg-gray-50 px-3 py-2 shadow-sm focus:border border-[var(--btn)]
                  focus:outline-none dark:bg-zinc-800 dark:text-zinc-200 "
          />
        </div>

        
        <span class="text-red-600" v-if="error_content">Une erreur est survenue : {{ error_content }}</span>

        
        <div class="flex justify-between mt-6">

          <button v-if="share_link !== ''" class="second" @click="copy_link">Copier</button>

          <div class="space-x-3">

            <button class="second" @click="emit('update:modelValue', false)">
              {{ share_link === '' ? 'Annuler' : 'Fermer' }}
            </button>

            <button class="danger primary" @click="create_share_link">Confirmer</button>
            
          </div>

        </div>

      </div>

    </Popup>

  </teleport>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Popup from '../Popup.vue';
import Switch from '../Switch.vue';
import { api_url } from '@/assets/ts/backend_link';

const props = defineProps<{
  uuid: string;
  title: string;
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const share_link = ref('');
const mn = ref(0);
const h = ref(1);
const passwd = ref('');
const editable = ref(false);
const error_content = ref('');

const visible = ref(props.modelValue);
watch(() => props.modelValue, v => visible.value = v);
watch(visible, v => emit('update:modelValue', v));

const create_share_link = async () => {
  const res = await fetch(`${api_url}/api/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      note_uuid: props.uuid,
      parms: {
        life: (h.value * 60 * 3600 * 100) + (mn.value * 3600 * 100),
        passwd: passwd.value || undefined,
        editable: editable.value
      }
    }),
  }).then(r => r.json());

  if (res.error) {
    error_content.value = res.message;
    return;
  }

  share_link.value = `https://app.silvernote.fr/share/${res.share.uuid}`;
};

const copy_link = () => navigator.clipboard.writeText(share_link.value);
</script>
