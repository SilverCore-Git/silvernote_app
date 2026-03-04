<template>

    <teleport to="body">

        <Popup v-model:visible="visible" @update:visible="visible = $event">

            <div @click.stop class="relative flex flex-col gap-6 " v-if="tag">

                <h2 class="text-start text-xl font-semibold drop-shadow-sm">
                    Paramètres du tag : <span class="text-(--text-little)">{{ tag.name }}</span>
                </h2>

                <div class="space-y-6">

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-bold">Nom du tag</label>
                        <input
                            v-model="tag.name"
                            ref="inputRef"
                            type="text"
                            maxlength="30"
                            class="px-3 py-2 rounded-xl bg-(--bg)/80 border border-(--btn)/40 focus:border-(--btn) outline-none shadow-inner placeholder-gray-400 transition"
                            placeholder="ex : Travail, Idée, Projet..."
                        />
                    </div>

                    <div class="flex flex-col gap-2">

                        <label class="text-sm font-bold">Couleur</label>

                        <div class="flex items-center justify-between bg-(--bg)/80 rounded-xl border border-(--btn)/40 px-3 py-2">
                            <span class="text-sm">Choisissez une couleur :</span>
                            <input
                                v-model="tag.color"
                                type="color"
                                class="cursor-pointer w-10 h-10 rounded-full border-2 border-(--btn)/50 transition hover:scale-110 hover:border-(--btn)"
                            />
                        </div>

                    </div>

                    <div class="flex flex-col justify-center items-center w-full">

                        <FilterCard
                            uuid=""
                            :color="tag.color"
                            :name="tag.name"
                            :active="true"
                        />

                    </div>

                </div>

                <div class="flex justify-end gap-3 mt-4">

                <button
                    class="primary danger"
                    @click="deleteTag(1)"
                >
                    Supprimer
                </button>

                <button
                    class="primary"
                    :class="tag.name.trim() ? '' : ' grayscale-100 pointer-events-none'"
                    @click="save"
                >
                    Sauvegarder
                </button>

                </div>

            </div>

        </Popup>

        <ConfirmDialog
            :visible="verifyDelete"
            title="Supprimer le tag sélectionné"
            message="Êtes-vous sûr de vouloir supprimer ce tag ?"
            @cancel="verifyDelete = false;"
            @confirm="deleteTag(2)"
        />

    </teleport>

</template>

<script lang="ts" setup>

import { Tags } from '@/assets/ts/database/Var';
import Popup from '@/components/popup/Popup.vue';
import { onMounted, ref, watch } from 'vue';
import FilterCard from './FilterCard.vue';
import type { Tag } from '@/assets/ts/type';
import ConfirmDialog from '@/components/popup/ConfirmDialog.vue';
import { useWSocket } from '@/composables/WSocket';

const props = defineProps<{
  uuid: string;
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);
const visible = ref<boolean>(props.modelValue);
watch(() => props.modelValue, v => {
  visible.value = v;
  tag.value = Tags.value.find(tag => tag.uuid == props.uuid);
});

const verifyDelete = ref<boolean>(false);
const tag = ref<Tag | undefined>(undefined);


const deleteTag = async (state: number) => {

    if (state == 1)
    {   
        emit('update:modelValue', false);
        verifyDelete.value = true;
    }
    else if (state == 2)
    {

        verifyDelete.value = false;

        (await useWSocket()).value.emit('tag:delete', tag.value);
        Tags.value = Tags.value.filter(tag => tag.uuid !== props.uuid);

    }

}

const save = async () => {

    if (!tag.value) return;
    tag.value._id = undefined;

    const index = Tags.value.findIndex(t => t.uuid === props.uuid);
    
    if (index !== -1) {
        Tags.value[index] = { ...tag.value }; 
    }

    (await useWSocket()).value.emit('tag:update', Tags.value[index]);

    emit('update:modelValue', false);

}


onMounted(() => {
    tag.value = Tags.value.find(tag => tag.uuid == props.uuid);
})

</script>