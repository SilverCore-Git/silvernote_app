
<template>

    <header class="flex flex-row relative" style="padding-top: calc(1rem + env(safe-area-inset-top)/2);">

        <div class="left-arrow absolute left-0" :class="hitbox ? 'bg-red-600' : ''" @click="router.push('/')"></div>

        <div class="legal absolute right-0" :class="hitbox ? 'bg-red-600' : ''" @click="router.push('/legale')"></div>

    </header>

    <div class="flex flex-col justify-start relative items-start min-h-[80VH] md:mx-[20%] mt-12 overflow-x-hidden">
        
        <section
            class="flex flex-col w-full gap-4"
        >

            <h1 
                class="text-2xl mb-1 font-bold"
            >
                Paramètres généraux
            </h1>

            <label
                class="cursor-pointer w-full flex justify-between items-center"
                :class="hitbox ? 'bg-red-600' : ''"
            >

              <span>Theme</span>

              <select
                id="theme"
                name="theme"
                v-model="theme"
                @change="setThemePreference(theme)"
                class="px-4 py-2 rounded-lg border border-gray-300 bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--btn)] focus:border-[var(--btn)] transition-all duration-200"
              >
                <option value="dark">Sombre</option>
                <option value="light">Claire</option>
                <option value="default">Automatique</option>
              </select>
              
            </label>

            <hr
                class="mb-2 mt-4 opacity-25"
            />

        </section>

        <!-- <section
            class="flex flex-col w-full gap-4"
        >

            <h1 
                class="text-2xl mb-1 font-bold"
            >
                Paramètres divers
            </h1>

            <hr
                class="mb-2 mt-4 opacity-25"
            />

        </section> -->

        <section
            class="flex flex-col w-full gap-4"
        >

            <h1 
                class="text-2xl mb-1 font-bold"
            >
                Paramètres base de données
            </h1>

            <label
                class="cursor-pointer w-full flex justify-between items-center"
                :class="hitbox ? 'bg-red-600' : ''"
            >

                <span>Télécharger la base de donnée</span>

                <button @click="download_db" class="primary">
                  Télécharger
                </button>

            </label>


            <label
                class="cursor-pointer w-full flex justify-between items-center"
                :class="hitbox ? 'bg-red-600' : ''"
            >

                <span>Téléverser une base de donnée</span>

                <div>
                  <button @click="open_input" class=" second">Téléversez un fichier</button>
                  <input ref="file_input" @change="get_db_file($event)" accept=".snote,.json" class="w-0" type="file">
                </div>

            </label>

            <label
                class="cursor-pointer w-full flex justify-between items-center"
                :class="hitbox ? 'bg-red-600' : ''"
            >

                <span>Réinitialiser les données</span>

                <button @click="reset_db(1)" class="primary danger">
                  Réinitialiser
                </button>

            </label>

        </section>

        <a class=" text-gray-500 hover:text-gray-700 cursor-pointer mt-50
                  flex justify-center items-center w-full text-center"
          @click="router.push('/dev')"
        >dev sandbox</a>

    </div>

  <ConfirmDialog
    :visible="showDialog"
    title="Confirmation"
    message="Voulez-vous vraiment réinitialiser vos donées ?"
    @confirm="reset_db(2)"
    @cancel="showDialog = false"
  />

  <Success v-if="success.value" :value="success.text" />
  <Danger v-if="danger.value" :value="danger.text" />

</template>

<script lang="ts" setup>

import { onMounted, reactive, watch, ref } from 'vue';
import { useRouter } from 'vue-router';

import ConfirmDialog from '@/components/popup/ConfirmDialog.vue';

import { version } from '../../../package.json';
import { SettingsDB, settings as settingsObj  } from '@/assets/ts/settings';
import type { Settings } from '@/assets/ts/type';
import { hitbox as if_hitbox } from '@/assets/ts/settings';
import indexed_db from '@/assets/ts/database/database';
import utils from '@/assets/ts/utils';
// import Switch from '@/components/Switch.vue';
import { setThemePreference } from '@/assets/ts/theme';
import Success from '@/components/alert/Success.vue';
import Danger from '@/components/alert/Danger.vue';
import { api_url } from '@/assets/ts/backend_link';

let hitbox: boolean;
onMounted(async () => { hitbox = await if_hitbox() })

const danger = ref<{ text: string, value: boolean }>({ text: "", value: false });
const success = ref<{ text: string, value: boolean }>({ text: "", value: false });

type Theme = 'dark' | 'light' | 'default';
const theme = ref<Theme>(localStorage.getItem('theme') as Theme || 'default');
const showDialog = ref<boolean>(false);
const file_input = ref<HTMLInputElement | undefined>(undefined);
const color = ref<string>('#F28C28');

watch(() => color.value, () => {
  document.documentElement.style.setProperty('--btn', color.value);
})

const db = new SettingsDB(settingsObj);
const router = useRouter();
const settings = reactive<Settings>({
  généraux: [],
  avancé: [],
  dev_mode: []
});

const open_input = () => file_input.value?.click();


const download_db = async () => {

  success.value.value = false;
  danger.value.value = false;

  const tags = await indexed_db.getAll('tags');
  const notes = await indexed_db.getAll('notes');

  const userAgent: string = navigator.userAgent;

  const sender_info = {
    userAgent,
    version,
    with: "blob"
  }

  const data_info = {
    tags_lenght: tags.length,
    notes_lenght: notes.length
  }

  const json_file = {
    tags,
    notes,
    sender_info,
    data_info,
    hash: {
      tags: await utils.hash(tags),
      notes: await utils.hash(notes),
      sender_info: await utils.hash(sender_info),
      data_info: await utils.hash(data_info)
    }
  };

  try {

      const blob = new Blob([JSON.stringify(json_file)], { type: 'application/snote' });

      const url = URL.createObjectURL(blob);
      const lien = document.createElement('a');
      lien.href = url;
      lien.download = 'mes_data_silvernote.snote';

      document.body.appendChild(lien); // création d'un <a> invisible
      lien.click(); // simulation du click
      document.body.removeChild(lien); // suprésion du <a>
      URL.revokeObjectURL(url);

      success.value.text = 'Fichier générer et télécharger.';
      success.value.value = true;

  }

  catch (err) {
    danger.value.text = 'Une erreur est survenue.';
    danger.value.value = true;
    return console.error('Une erreur est survenur lors de la préparation du téléchargement de la db : ', err);
  }

}

const get_db_file = async (event: Event): Promise<void> => {

  danger.value.value = false;
  success.value.value = false;

  const input = event.target as HTMLInputElement;

  if (input.files) {
    
    const file = input.files[0];

    const reader = new FileReader();

    
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const contenu = e.target?.result

      if (typeof contenu === "string") {

        try {

          const data = JSON.parse(contenu)

          const tags_hash_ok: boolean = await utils.hash(data.tags) === data.hash.tags;
          const notes_hash_ok: boolean = await utils.hash(data.notes) === data.hash.notes;
          const sender_info_hash_ok: boolean = await utils.hash(data.sender_info) === data.hash.sender_info;
          const data_info_hash_ok: boolean = await utils.hash(data.data_info) === data.hash.data_info;

          if (tags_hash_ok) console.log('Hash tags ok !'); else console.warn('Hash tags incorect !');
          if (notes_hash_ok) console.log('Hash notes ok !'); else console.warn('Hash notes incorect !');
          if (sender_info_hash_ok) console.log('Hash sender_info ok !'); else console.warn('Hash sender_info incorect !');
          if (data_info_hash_ok) console.log('Hash data_info ok !'); else console.warn('Hash data_info incorect !');

          if (tags_hash_ok && notes_hash_ok && sender_info_hash_ok && data_info_hash_ok) {

            console.log('All hash ok !');
            console.log('Starting eating data...');

            try {
              await indexed_db.add_notes(data.notes, true);
            } catch(err) { throw new Error('Erreur lors de la sync des notes.') }

            try {
              await indexed_db.add_tags(data.tags, true);
            } catch(err) { throw new Error('Erreur lors de la sync des tags.') }

          }
          else 
          {
            danger.value.text = "Fichier refusé, défaillant ou trafiqué.";
            danger.value.value = true;
            throw new Error(`Hash not valid.\n\n Hashes:\n  Tags: ${await utils.hash(data.tags)} || ${data.hash.tags}\n  Notes: ${await utils.hash(data.notes)} || ${data.hash.notes}\n  Sender Info: ${await utils.hash(data.sender_info)} || ${data.hash.sender_info}\n  Data Info: ${await utils.hash(data.data_info)} || ${data.hash.data_info}\n\nValidation:\n  Tags OK: ${await utils.hash(data.tags) === data.hash.tags}\n  Notes OK: ${await utils.hash(data.notes) === data.hash.notes}\n  Sender Info OK: ${await utils.hash(data.sender_info) === data.hash.sender_info}\n  Data Info OK: ${await utils.hash(data.data_info) === data.hash.data_info}`)
          }

        } catch (err) {
          danger.value.text = "Une erreur est survenue";
          danger.value.value = true;
          return console.error("Une erreur est survenue, step : parse data / eating data / verify hash :", err)
        }

        console.log('Database eat end !');
        success.value.text = 'Fichier injecté.';
        success.value.value = true;

      }
    }

    reader.readAsText(file);

  }

}

const reset_db = async (step: number): Promise<void> => {

  if (step == 2) {
    showDialog.value = false;
    success.value.value = false;
    danger.value.value = false;

    try {
      await indexed_db.reset();
      await fetch(`${api_url}/api/db/delete/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
      })
      success.value.text = 'Base de données réinitialiser !'
      success.value.value = true;
    }
    catch (err) {
      danger.value.text = 'Une erreur est survenue.';
      danger.value.value = true;
      return console.error("Une erreur est survenue, step : reset db :", err)
    }

  
  } 
  else 
  {
    showDialog.value = true
  }

}

onMounted(async () => {
    Object.assign(settings, await db.get());
});

watch(settings, async () => {
    await db.save(JSON.parse(JSON.stringify(settings)));
    console.log('Parametre modifier : ', Object.values(settings));
}, { deep: true });

</script>

<style scoped>


.legal {
  width: 30px;
  height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.legal {
  background-image: url('../assets/svgs/legal.svg');
  filter: brightness(0) saturate(100%) invert(55%) sepia(65%) saturate(538%) hue-rotate(343deg) brightness(98%) contrast(98%);
}

.reload-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../assets/svgs/reload.svg');
}

.moon-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/assets/svgs/moon.svg');
    filter: invert(1);
    transition: all 0.3s;
}

.sun-svg {
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('/assets/svgs/sun.svg');
    transition: all 0.3s;
}

</style>