<template>

  <teleport to="body">

    <Popup v-model:visible="visible" @update:visible="visible = $event">

      <div @click.stop class="relative flex flex-col gap-6 ">

        <h2 class="text-center text-xl font-semibold drop-shadow-sm">
          Partager la note : <span class="text-[#F28C28]">{{ title }}</span>
        </h2>

        <div class="space-y-6">

          <div class="bg-[var(--bg)]/70 rounded-2xl p-4 border border-[#F28C28]/40 shadow-inner">

            <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
              ⏳ Durée de validité
            </h3>

            <div class="flex flex-wrap items-center gap-6">

              <div class="flex items-center gap-2">
                <input
                  v-model="j"
                  type="number"
                  min="0"
                  max="24"
                  class="w-20 px-2 py-1 text-center rounded-xl bg-[var(--bg2)]/80 border border-[#F28C28]/40 focus:border-[#F28C28] outline-none transition"
                />
                <span class="text-sm">jours</span>
              </div>

              <div class="flex items-center gap-2">
                <input
                  v-model="h"
                  type="number"
                  min="0"
                  max="24"
                  class="w-20 px-2 py-1 text-center rounded-xl bg-[var(--bg2)]/80 border border-[#F28C28]/40 focus:border-[#F28C28] outline-none transition"
                />
                <span class="text-sm">heures</span>
              </div>

            </div>

          </div>

          <div class="bg-[var(--bg)]/70 rounded-2xl p-4 border border-[#F28C28]/40 shadow-inner flex items-center justify-between">

            <div class="mr-2">

              <h3 class="text-lg font-semibold mb-1 ">✏️ Modification</h3>
              <p class="text-sm">Autoriser les personnes à modifier la note partagée.</p>

            </div>

            <Switch v-model="editable" />

          </div>

          <div class="bg-[var(--bg)]/70 rounded-2xl p-4 border border-[#F28C28]/40 shadow-inner">

            <div class="flex justify-between items-center mb-2">

              <h3 class="text-lg font-semibold ">🔒 Mot de passe</h3>

              <Switch v-model="password" />

            </div>

            <transition name="fade">

              <div
                v-if="password"
                class="transition-all duration-300 mt-3"
              >

                <input
                  v-model="passwd"
                  type="text"
                  placeholder="Entrer un mot de passe..."
                  class="w-full px-3 py-2 rounded-xl bg-[var(--bg2)]/80 border border-[#F28C28]/40 focus:border-[#F28C28] outline-none transition"
                />

              </div>

            </transition>

          </div>

          <transition name="fade">

            <div v-if="share_link" class="bg-[var(--bg)]/70 rounded-2xl p-4 border border-[#F28C28]/40 shadow-inner">

              <h3 class="text-lg font-semibold mb-2 ">🔗 Lien généré</h3>

              <div class="flex items-center gap-2">

                <input
                  :value="share_link"
                  type="url"
                  readonly
                  class="flex-1 rounded-xl px-3 py-2 bg-[var(--bg2)]/80 border border-[#F28C28]/40  outline-none"
                />

                <button 
                  @click="copy_link" 
                  class="primary"
                >
                  Copier
                </button>

              </div>

            </div>

          </transition>

          <p v-if="error_content" class="text-red-500 text-sm">
            ❌ Une erreur est survenue : {{ error_content }}
          </p>

        </div>

        <div class="flex justify-end gap-3 mt-4">

          <button
            class="primary danger"
            @click="emit('update:modelValue', false)"
          >
            {{ share_link === '' ? 'Annuler' : 'Fermer' }}
          </button>

          <button
            class="primary"
            @click="create_share_link"
          >
            Confirmer
          </button>

        </div>

      </div>

    </Popup>

  </teleport>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Popup from './Popup.vue';
import Switch from '../Switch.vue';
import { api_url } from '@/assets/ts/backend_link';

const props = defineProps<{
  uuid: string;
  title: string;
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const share_link = ref<string>('');
const h = ref<number>(0);
const j = ref<number>(1);
const passwd = ref<string>('');
const password = ref<boolean>(false);
const editable = ref<boolean>(false);
const error_content = ref<string>('');

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
        life: (j.value * 24 * 60 * 3600 * 100) + (h.value * 60 * 3600 * 100),
        passwd: password ? passwd.value : undefined,
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

const copy_link = () => {
  navigator.clipboard.writeText(share_link.value);
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
