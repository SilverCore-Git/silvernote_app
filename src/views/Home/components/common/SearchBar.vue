<template>

    <search
        class="
            flex justify-center items-center flex-row 
            border rounded-2xl bg-(--white)
            py-3 px-3.5 w-full gap-[10px]
            transition-all duration-300 ease-in-out
        "
        :class="isFocus ? 'border-(--btn) text-(--btn)' : 'border-gray-300 text-(--text)'"
    >

        <i class="bi bi-search opacity-50" />

        <input 
            type="search"
            placeholder="Rechercher vôtre note..."
            class="w-full outline-none"
            v-model="query"
            @focus="isFocus = true"
            @blur="isFocus = false"
        />

    </search>

</template>


<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const query = ref<string>('');
const isFocus = ref<boolean>(false);


watch(() => query.value, () => {
    router.push({
        query: {
            q: query.value
        }
    });
});

watch(() => isFocus.value, () => {
    router.push({
        query: {
            q: isFocus.value ? query.value : undefined
        }
    });
})

</script>