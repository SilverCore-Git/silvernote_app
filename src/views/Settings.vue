
<template>

    <header class="flex flex-row relative" style="padding-top: calc(1rem + env(safe-area-inset-top)/2);">

        <div class="left-arrow absolute left-4" :class="hitbox ? 'bg-red-600' : ''" @click="router.push('/')"></div>

        <div class="legal absolute right-4" :class="hitbox ? 'bg-red-600' : ''" @click="router.push('/legale')"></div>

    </header>

    <div class="flex flex-col justify-start relative items-start min-h-[80VH] ml-4 mr-4 mt-12 overflow-x-hidden">
        
        <section
            class="flex flex-col w-full gap-4"
            v-for="(section, sectionIndex) in Object.values(settings)"
            :key="sectionIndex"
        >

            <h1 
                style="font-family: 'Montserrat'" 
                class="text-2xl mb-1 font-bold"
                v-if="!isDevModSection(Object.keys(settings)[sectionIndex]) || isDevModeEnabled()"
            >
                Paramètres {{ Object.keys(settings)[sectionIndex] }}
            </h1>

            <label
                class="cursor-pointer w-full flex justify-between items-center"
                v-for="(option, optionIndex) in section"
                v-if="!isDevModSection(Object.keys(settings)[sectionIndex]) || isDevModeEnabled()"
                :for="`switch-${sectionIndex}-${optionIndex}`"
                :key="optionIndex"
                :class="hitbox ? 'bg-red-600' : ''"
            >

                <span>{{ option.name }}</span>

                <div class="switch flex flex-row">

                <div>

                    <input
                        :id="`switch-${sectionIndex}-${optionIndex}`"
                        type="checkbox"
                        v-model="option.active"
                    />

                    <span class="slider"></span>

                </div>

                </div>

            </label>

            <hr
                v-if="!isDevModSection(Object.keys(settings)[sectionIndex]) || isDevModeEnabled()"
                class="mb-2 mt-4 opacity-25"
            />
            
        </section>

        <section
            class="flex flex-col w-full gap-4"
        >

            <h1 
                style="font-family: 'Montserrat'" 
                class="text-2xl mb-1 font-bold"
            >
                Paramètres base de données
            </h1>

            <label
                class="cursor-pointer w-full flex justify-between items-center"
                :class="hitbox ? 'bg-red-600' : ''"
            >

                <span>Télécharger la base de donnée</span>

                <div @click="download_db">

                  <div class="button" data-tooltip="Size: 20Mb">
                  <div class="button-wrapper">
                    <div class="text">Télécharger</div>
                      <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
                      </span>
                    </div>
                  </div>

                </div>

            </label>


            <label
                class="cursor-pointer w-full flex justify-between items-center"
                :class="hitbox ? 'bg-red-600' : ''"
            >

                <span>Téléverser une base de donnée</span>

                <div>
                  <span class=" border-1 border-[var(--btn)] p-1 rounded">Téléversez le fichier</span>
                  <input @change="get_db_file($event)" accept=".json,application/json" class="w-0" type="file">
                </div>

            </label>

            <label
                class="cursor-pointer w-full flex justify-between items-center"
                :class="hitbox ? 'bg-red-600' : ''"
            >

                <span>Réinitialiser les données</span>

                <div @click="reset_db(1)">
                  <div class="button danger" data-tooltip="Size: 20Mb">
                  <div class="button-wrapper">
                    <div class="text">Réinitialiser</div>
                      <span class="icon"><div class="bin-svg"></div></span>
                    </div>
                  </div>
                </div>

            </label>
            
        </section>

    </div>

  <ConfirmDialog
    :visible="showDialog"
    title="Confirmation"
    message="Voulez-vous vraiment supprimer cette note ?"
    @confirm="reset_db(2)"
    @cancel="showDialog = false"
  />

</template>

<script lang="ts" setup>

import { onMounted, reactive, watch, ref } from 'vue';
import { useRouter } from 'vue-router';

import ConfirmDialog from '../components/ConfirmDialog.vue';

import { SettingsDB, settings as settingsObj  } from '../assets/ts/settings';
import type { Settings } from '../assets/ts/type';
import { hitbox as if_hitbox } from '../assets/ts/settings';
import indexed_db from '../assets/ts/database';

import { init_theme } from '../assets/ts/theme';
onMounted(() => { init_theme() });

let hitbox: boolean;
onMounted(async () => { hitbox = await if_hitbox() })

const showDialog = ref<boolean>(false);

const db = new SettingsDB(settingsObj);
const router = useRouter();
const settings = reactive<Settings>({
  généraux: [],
  avancé: [],
  dev_mode: []
});

const isDevModSection = (sectionName: string): boolean => {
    return sectionName == 'dev_mode';
};

const isDevModeEnabled = (): boolean => {

    const advenced = settings['avancé'];
    if (!advenced) return false;

    const devModeOption = advenced.find(opt => opt.name === 'Mode développeur');
    if (devModeOption?.active) settings.dev_mode.map(parm => parm.active == false);
    return devModeOption?.active ?? false;

};

const download_db = async () => {

  const tags = await indexed_db.getAll('tags');
  const notes = await indexed_db.getAll('notes');

  const json_file = {
    tags,
    notes
  };

  const blob = new Blob([JSON.stringify(json_file, null, 2)], { type: 'application/json' }); // utilisation de blob pour créer une ressource avec des données brut

  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = 'mes_data_silvernote.json';

  document.body.appendChild(lien); // création d'un <a> invisible
  lien.click(); // simulation du click
  document.body.removeChild(lien); // suprésion du <a>
  URL.revokeObjectURL(url);

}

const get_db_file = async (event: Event): Promise<void> => {

  const input = event.target as HTMLInputElement;

  if (input.files) {
    const file = input.files[0];

    const reader = new FileReader();

    
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const contenu = e.target?.result

      if (typeof contenu === "string") {

        try {

          const data = JSON.parse(contenu)

          try {
            await indexed_db.add_notes(data.notes);
          } catch(err) { throw new Error('Erreur lors de la sync des notes.') }

          try {
            await indexed_db.add_tags(data.tags);
          } catch(err) { throw new Error('Erreur lors de la sync des tags.') }

        } catch (err) {
          return console.error("Une erreur est survenue, step : parse data / save data :", err)
        }
        console.log('Database chargé !')
        window.location.reload();
      }
    }

    reader.readAsText(file);

  }

}

const reset_db = async (step: number): Promise<void> => {

  if (step == 2) {
    showDialog.value = false
    await indexed_db.reset();
    window.location.reload();
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

/* download btn */
/* From Uiverse.io by satyamchaudharydev */ 
.button {
  --width: 100px;
  --height: 35px;
  --gap-between-tooltip-to-button: 18px;
  --button-color: var(--btn);
  width: var(--width);
  height: var(--height);
  background: var(--button-color);
  position: relative;
  text-align: center;
  border-radius: 0.45em;
  font-family: "Arial";
  transition: background 0.3s;
}

.danger {
  --button-color: rgb(255, 72, 0);
}

.button::after,.button::before {
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s;
}

.text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-wrapper,.text,.icon {
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  color: #fff;
}

.text {
  top: 0
}

.text,.icon {
  transition: top 0.5s;
}

.icon {
  color: #fff;
  top: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon svg {
  height: 24px;
  width: 24px;
}

.icon .bin-svg {
  height: 24px;
  width: 24px;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('../assets/svgs/bin.svg');
  filter: invert(36%) sepia(76%) saturate(4375%) hue-rotate(-10deg) brightness(92%) contrast(110%);
  transition: all 0.3s ease;
}

.button:hover {
  background: #6c18ff;
}

.button:hover .text {
  top: -100%;
}

.button:hover .icon {
  top: 0;
}

.button:hover:before,.button:hover:after {
  opacity: 1;
  visibility: visible;
}

.button:hover:after {
  bottom: calc(var(--height) + var(--gap-between-tooltip-to-button) - 20px);
}

.button:hover:before {
  bottom: calc(var(--height) + var(--gap-between-tooltip-to-button));
}


</style>