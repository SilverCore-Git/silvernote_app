<template>

    <PressAndHold
        @long-press="tagDel = !tagDel"
        class="h-full"
    >

        <div 
            class="
                bg-(--white) border rounded-2xl flex-row
                flex justify-center items-center gap-1
                px-3 py-1.5 cursor-pointer
            "
            :class="[
                active ? 'border-(--btn)' : 'border-gray-200',
                tagDel ? 'border-b-transparent rounded-b-none' : ''
            ]"
        >

            <div
                :style="{ backgroundColor: color }"
                class="
                    rounded-full w-3 h-3
                "
            />

            <span
                class=" uppercase text-xs"
            >
                {{ name }}
            </span>

        </div>

        <div
            class="
                bg-(--white) border rounded-2xl 
                flex justify-center items-center gap-1 flex-col
                px-3 py-1.5 cursor-pointer border-gray-200
                border-t-red-600 rounded-t-none
            "
            v-if="tagDel"
        >

            <span
                @click.stop="deleteTag(1)"
                class=" text-red-600"
            >
                Supprimer
            </span>

            <hr class="w-full text-(--text-little)" />

            <span @click.stop="tagDel = false">
                Annuller
            </span>

        </div>

    </PressAndHold>

    <ConfirmDialog
        :visible="verifyDelete"
        title="Supprimer un tag"
        message="Etes vous sur de vouloir supprimer ce tag ?"
        @cancel="verifyDelete = false; tagDel = false"
        @confirm="deleteTag(2)"
    />



</template>

<script lang="ts" setup>
import database from '@/assets/ts/database/database';
import { Tags } from '@/assets/ts/database/Var';
import ConfirmDialog from '@/components/popup/ConfirmDialog.vue';
import PressAndHold from '@/components/PressAndHold.vue';
import { ref } from 'vue';

const props = defineProps<{
    uuid: string;
    color: string;
    name: string;
    active: boolean;
}>();

const tagDel = ref<boolean>(false);
const verifyDelete = ref<boolean>(false);

const deleteTag = async (state: number) => {

    if (state == 1)
    {   
        verifyDelete.value = true;
    }
    else if (state == 2)
    {

        verifyDelete.value = false;
        tagDel.value = false;

        await database.delete_tag(props.uuid);
        Tags.value = Tags.value.filter(tag => tag.uuid !== props.uuid);

    }
}

</script>