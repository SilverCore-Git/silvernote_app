<template>

  <teleport to="body">

    <Popup v-model:visible="visible" @update:visible="visible = $event">

      <div  
        @click.stop 
        class="max-w-lg w-full rounded-2xl"
      >

        <h2 class="text-2xl font-bold text-center mb-6">
          Partager la note : <span class="text-[var(--btn)]">{{ title }}</span>
        </h2>

        <div class="space-y-6">
          
          <div class="rounded-xl p-4">

            <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
              ⏳ Durée de validité
            </h3>

            <div class="flex items-center gap-6">

              <div class="flex items-center gap-2">

                <input
                  v-model="j"
                  type="number"
                  min="0"
                  max="24"
                  class="w-16 rounded-lg px-2 py-1 text-center border focus:outline-none focus:border-[var(--btn)]"
                />

                <span>jours</span>

              </div>

              <div class="flex items-center gap-2">

                <input
                  v-model="h"
                  type="number"
                  min="0"
                  max="24"
                  class="w-16 rounded-lg px-2 py-1 text-center border focus:outline-none focus:border-[var(--btn)]"
                />

                <span>heures</span>

              </div>

            </div>

          </div>

          <div class="rounded-xl p-4 flex items-center justify-between">

            <div>

              <h3 class="text-lg font-semibold mb-1">✏️ Modification</h3>

              <p class="text-sm ">
                Autoriser les personnes à modifier la note partagée.
              </p>

            </div>

            <Switch v-model="editable" />

          </div>

          <div class="rounded-xl p-4">

            <div class="flex justify-between">

              <h3 class="text-lg font-semibold mb-2">🔒 Mot de passe</h3>

              <Switch v-model="password" />

            </div>

            <div
              :class="password ? 'translate-0 relative' : 'opacity-0 absolute pointer-events-none -translate-y-5'"
              class="transition-all duration-300"
            >

              <input
                v-model="passwd"
                type="text"
                placeholder="Entrer un mot de passe..."
                class="w-full rounded-lg border focus:outline-none focus:border-[var(--btn)] p-1 pl-2"
              />

            </div>

          </div>

          <transition name="fade">

            <div v-if="share_link" class="rounded-xl p-4">

              <h3 class="text-lg font-semibold mb-2">🔗 Lien généré</h3>

              <div class="flex items-center gap-2">

                <input
                  :value="share_link"
                  type="url"
                  readonly
                  class="flex-1 rounded-lg px-3 py-2 border"
                />

                <button @click="copy_link" class="primary">
                  Copier
                </button>

              </div>

            </div>

          </transition>

          <p v-if="error_content" class="text-red-500 text-sm">
            ❌ Une erreur est survenue : {{ error_content }}
          </p>

        </div>

        <div class="flex justify-end gap-3 mt-8">

          <a
            class="px-4 py-2"
            @click="emit('update:modelValue', false)"
          >
            {{ share_link === '' ? 'Annuler' : 'Fermer' }}
          </a>

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
