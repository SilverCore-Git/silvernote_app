<template>

    <div
        class="bg-transparent flex justify-center items-center 
        w-full z-50 inset-x-0 bottom-0"
        :class="pos
                    ? pos
                    : 'fixed'
        "   
    >
        <button 
             v-tooltip="'Créer une note'"
            @click="emit('btn_click')"
            style="box-shadow: 0 0 15px #3636364f; "
            class="add-note-btn cursor-pointer rounded-full
                    flex items-center justify-center mb-8 p-2
                  "
        ><div class="add-note-svg"></div></button>
    </div>

</template>


<script lang="ts" setup>

defineProps<{
    pos?: string;
}>();

const emit = defineEmits<{
  (e: 'btn_click'): void
}>()

</script>

<style scoped>

    .add-note-btn {
        background-color: var(--btn);
        transition: all 0.3s;
    }

    .add-note-btn:hover {
        transform: scale(1.2);
    }

    .add-note-svg {

        -webkit-mask-image: url('../../assets/svgs/plus.svg');
        mask-image: url('../../assets/svgs/plus.svg');
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: contain;
        mask-size: contain;
        background-color: #FFF8F0;
        width: 45px;
        height: 45px;
    }

</style>