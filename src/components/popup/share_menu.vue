<template>

  <teleport to="body">

    <Popup
      v-model:visible="visible"
      @update:visible="emit('update:modelValue', $event)"
    >

      <div 
        @click.stop 
        class="relative flex flex-col gap-5 max-w-md w-full"
      >
        
        <header>

          <h2 class="text-xl font-bold tracking-tight">
            {{ isExist ? 'Paramètres du partage' : 'Partager la note' }}
          </h2>

          <p class="text-(--text-little) text-xs mt-1">
            {{ title }}
          </p>

        </header>

        <div class="space-y-4">

          <div
            class="
              bg-(--bg)/40 rounded-2xl
              p-4 border border-(--text)/5
            "
          >

            <h3
              class="
                text-xs font-bold uppercase
                tracking-wider mb-3
                flex items-center gap-2
              "
            >

              <i class="bi bi-clock-history text-orange-400"/>
              Durée de validité

            </h3>

            <div class="flex items-center gap-4">

              <div
                class="
                  flex-1 flex items-center bg-(--bg2)/60
                  rounded-xl border border-(--text)/5 px-3
                  focus-within:border-(--btn)/50 transition
                "
              >
              
                <input
                  v-model="j"
                  type="number" 
                  min="0" 
                  max="365" 
                  class="w-full bg-transparent py-2 outline-none text-sm"
                />

                <span class="text-[10px] uppercase font-bold opacity-50 ml-2">
                  Jours
                </span>

              </div>

              <div
                class="
                  flex-1 flex items-center bg-(--bg2)/60
                  rounded-xl border border-(--text)/5 px-3
                  focus-within:border-(--btn)/50 transition
                "
              >
              
                <input
                  v-model="h"
                  type="number" 
                  min="0" 
                  max="23" 
                  class="w-full bg-transparent py-2 outline-none text-sm"
                />

                <span class="text-[10px] uppercase font-bold opacity-50 ml-2">
                  Heures
                </span>

              </div>

            </div>

          </div>

          <div
            class="
              bg-(--bg)/40 rounded-2xl p-4
              border border-(--text)/5
              flex items-center justify-between
            "
          >

            <div class="flex items-center gap-3">

              <div class="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <i class="bi bi-pencil-square" />
              </div>

              <div>

                <h3 class="text-sm font-semibold">
                  Édition autorisée
                </h3>

                <p class="text-[11px] text-(--text-little)">
                  Les invités peuvent modifier la note
                </p>

              </div>

            </div>

            <Switch v-model="editable" />

          </div>

          <div class="bg-(--bg)/40 rounded-2xl p-4 border border-(--text)/5">

            <div class="flex justify-between items-center">

              <div class="flex items-center gap-3">

                <div class="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <i class="bi bi-shield-lock" />
                </div>

                <h3 class="text-sm font-semibold">
                  Protection
                </h3>

              </div>

              <Switch v-model="password" />

            </div>

            <transition name="pop">

              <div v-if="password" class="mt-3">

                <input
                  v-model="passwd"
                  :type="isExist && !isEditingPass ? 'password' : 'text'"
                  @focus="isEditingPass = true"
                  placeholder="Définir un mot de passe..."
                  class="
                    w-full px-4 py-2.5 rounded-xl
                    bg-(--bg2)/60 border border-(--text)/5
                    focus:border-(--btn)/50 outline-none
                    text-sm transition
                  "
                />

              </div>

            </transition>

          </div>

          <transition name="pop">

            <div 
              v-if="share_link" 
              class="bg-(--btn)/5 rounded-2xl p-4 border border-(--btn)/20"
            >

              <h3 class="text-[10px] uppercase font-bold text-(--btn)/70 mb-2 tracking-widest">
                Lien de partage
              </h3>

              <div class="flex items-center gap-2">

                <input
                  :value="share_link"
                  readonly
                  class="default-input"
                />

                <button
                  @click="copy_link" 
                  class="primary"
                  :class="copied ? 'green' : ''"
                >
                  {{ copied ? 'Copié !' : 'Copier' }}
                </button>

              </div>

            </div>

          </transition>

          <p 
            v-if="error_content" 
            class="text-red-400 text-xs text-center font-medium px-4"
          >
            <i class="bi bi-exclamation-circle mr-1" />
            {{ error_content }}
          </p>

        </div>

        <footer class="flex justify-end gap-3 mt-2">

          <button 
            v-if="isExist"
            class="primary danger"
            @click="delete_share(1)"
          >
            Supprimer
          </button>

          <button
            class="primary"
            :class="loader ? 'loader' : ''"
            @click="create_share_link"
          >
            {{ !share_link ? 'Générer le lien' : 'Mettre a jour' }}
          </button>

        </footer>

      </div>

    </Popup>

  </teleport>

  <ConfirmDialog
      :visible="showConfirmDel"
      title="Supprimer les notes séléctionnées"
      message="Êtes-vous sûr de vouloir supprimer ces notes ?"
      @cancel="showConfirmDel = false; emit('update:modelValue', false)"
      @confirm="delete_share(2)"
  />

</template>

<script setup lang="ts">

import { nextTick, onMounted, ref, watch } from 'vue';
import Popup from './Popup.vue';
import Switch from '../Switch.vue';
import { api_url } from '@/assets/ts/backend_link';
import useToken from '@/composables/useToken';
import ConfirmDialog from './ConfirmDialog.vue';
import { ShareByMe } from '@/assets/ts/database/Var';

const props = defineProps<{
  uuid: string;
  title?: string;
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);


// State
const isExist = ref<boolean>(false);
const isEditingPass = ref<boolean>(false);
const share_link = ref<string>('');
const h = ref<number>(0);
const j = ref<number>(1);
const passwd = ref<string>('');
const password = ref<boolean>(false);
const editable = ref<boolean>(false);
const error_content = ref<string>('');
const visible = ref<boolean>(props.modelValue);
const copied = ref<boolean>(false);
const loader = ref<boolean>(false);
const showConfirmDel = ref<boolean>(false);


// Reset & Sync
watch(() => props.modelValue, v => {
  visible.value = v;
  if (v) {
    share_link.value = '';
    error_content.value = '';
    isEditingPass.value = false;
    mount();
  }
});

const create_share_link = async () => {

  loader.value = true;
  error_content.value = '';
  share_link.value = '';

  await nextTick();
  
  const life_in_ms = (j.value * 24 * 3600 * 100) + (h.value * 3600 * 100);

  try {

    const res = await fetch(`${api_url}/api/share/${isExist.value ? `${props.uuid}/update` : 'create'}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await useToken()
      },
      body: JSON.stringify({
        note_uuid: props.uuid,
        params: {
          life: life_in_ms,
          passwd: password.value ? passwd.value : undefined,
          editable: editable.value
        }
      }),
    }).then(r => r.json());

    if (res.error)
    {
      error_content.value = res.message;
      return;
    }

    share_link.value = `https://${window.location.host}/share/${res.share.uuid}`;

  }
  catch (e) {
    error_content.value = "Impossible de contacter le serveur.";
  }
  finally {
    loader.value = false;
  }

};

const delete_share = async (state: 1 | 2) => {

  if (state == 1) {
    visible.value = false;
    showConfirmDel.value = true;
    return;
  }

  loader.value = true;
  error_content.value = '';
  share_link.value = '';

  await nextTick();

  try {

    const res = await fetch(`${api_url}/api/share/${props.uuid}/delete`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await useToken()
      }
    }).then(r => r.json());

    if (res.error)
    {
      error_content.value = res.message;
      return;
    }

    ShareByMe.value = ShareByMe.value.filter(share => share.uuid !== props.uuid);

    share_link.value = '';
    h.value = 0;
    j.value = 1;
    passwd.value = '';
    password.value = false;
    editable.value = false;
    error_content.value = '';
    isExist.value = false;

    await nextTick();

    emit('update:modelValue', false);

  }
  catch (e) {
    error_content.value = "Impossible de contacter le serveur.";
  }
  finally {
    loader.value = false;
    showConfirmDel.value = false
    emit('update:modelValue', false);
  }

}

const copy_link = () => {
  navigator.clipboard.writeText(share_link.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
};

const mount = async () => {

  try {

    const res = await fetch(`${api_url}/api/share/${props.uuid}/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await useToken()}`
      }
    }).then(r => r.json());
    
    isExist.value = res.success;

    if (res.success && res.share)
    {

      const life = res.share.params.life;
      
      j.value = Math.floor(life / (24 * 3600 * 100));
      h.value = Math.floor((life % (24 * 3600 * 100)) / (3600 * 100));
      
      password.value = !!res.share.params.passwd;
      passwd.value = res.share.params.passwd || '';
      editable.value = res.share.params.editable;
      share_link.value = `https://${window.location.host}/share/${res.share.uuid}`;

    }

  } catch (e) {
    console.error("Erreur mount share:", e);
  }

};

</script>

<style scoped>
.pop-enter-active, .pop-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.pop-enter-from { opacity: 0; transform: translateY(-10px) scale(0.98); }
.pop-leave-to { opacity: 0; transform: translateY(-5px); }
</style>