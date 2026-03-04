<template>

            <Popup
                :visible="visible"
                @update:visible="emit('close')"
            >

                <div
                    class="
                        relative flex flex-col gap-6 
                    "
                    @click.stop
                >
                    
                    <h2 class="text-center text-xl font-semibold text-[var(--btn)] drop-shadow-sm">
                        Nouveau tag
                    </h2>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-bold">Nom du tag</label>
                        <input
                            v-model="tag_name"
                            ref="inputRef"
                            type="text"
                            maxlength="30"
                            class="px-3 py-2 rounded-xl bg-[var(--bg)]/80 border border-[var(--btn)]/40 focus:border-[var(--btn)] outline-none shadow-inner placeholder-gray-400 transition"
                            placeholder="ex : Travail, Idée, Projet..."
                        />
                    </div>

                    <div class="flex flex-col gap-2">

                        <label class="text-sm font-bold">Couleur</label>

                        <div class="flex items-center justify-between bg-[var(--bg)]/80 rounded-xl border border-[var(--btn)]/40 px-3 py-2">
                            <span class="text-sm">Choisissez une couleur :</span>
                            <input
                                v-model="tag_color"
                                type="color"
                                class="cursor-pointer w-10 h-10 rounded-full border-2 border-[var(--btn)]/50 transition hover:scale-110 hover:border-[var(--btn)]"
                            />
                        </div>

                    </div>

                    <div class="flex flex-col justify-center items-center w-full">

                        <FilterCard
                            uuid=""
                            :color="tag_color"
                            :name="tag_name"
                            :active="true"
                        />

                    </div>

                    <div class="flex gap-3 justify-center mt-2">

                        <button
                            class="primary flex-1"
                            @click.stop="create_tag"
                        >
                            Créer
                        </button>

                    </div>

                </div>

            </Popup>

</template>

<script lang="ts" setup>

import utils from '@/assets/ts/utils';
import Popup from '@/components/popup/Popup.vue';
import { nextTick, ref, watch } from 'vue';
import FilterCard from './FilterCard.vue';
import { Tags } from '@/assets/ts/database/Var';
import { useWSocket } from '@/composables/WSocket';

const emit = defineEmits([
    'close'
]);

const props = defineProps({
    visible: Boolean
});

const tag_name = ref<string>('');
const tag_color = ref<string>(utils.getRandomHexColor());
const inputRef = ref<HTMLInputElement | null>(null);


const create_tag = async () => {

    const tag = {
        id: parseInt(Date.now() + Math.floor(Math.random() * 1000).toString()), 
        user_id: window.localStorage.getItem('user_id') || '',
        uuid: '',
        name: tag_name.value, 
        active: false, 
        color: tag_color.value 
    }

    Tags.value.push(tag);
    (await useWSocket()).value.emit('tag:create', tag);

    tag_name.value = '';
    tag_color.value = '';

    emit('close');

}

watch(() => props.visible, async () => {
    await nextTick();
    tag_name.value = '';
    tag_color.value = utils.getRandomHexColor();
    inputRef.value?.focus();
})


</script>