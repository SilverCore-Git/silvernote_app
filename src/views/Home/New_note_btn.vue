<template>
    <button 
        v-tooltip="'Créer une note'"
        @click="emit('btn_click')"
        style="box-shadow: 0 0 15px #3636364f; "
        class="add-note-btn cursor-pointer rounded-2xl w-full
                flex items-center justify-center h-full scale
              "
    ><div class="add-note-svg"></div></button>
</template>


<script lang="ts" setup>

const emit = defineEmits<{
  (e: 'btn_click'): void
}>()

</script>

<style scoped>

    .add-note-btn {
        background-color: var(--btn);
        transition: all 0.3s;
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