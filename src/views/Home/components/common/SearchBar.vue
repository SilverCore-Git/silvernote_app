<template>

    <search
        class="
            flex justify-center items-center flex-row 
            border rounded-2xl bg-(--white)
            py-3 px-3.5 w-full gap-2.5
            transition-all duration-300 ease-in-out
        "
        :class="isFocus ? 'border-(--btn)' : 'border-gray-300'"
    >

        <i class="bi bi-search opacity-50" />

        <input 
            type="search"
            placeholder="Rechercher vôtre note..."
            class="w-full outline-none"
            v-model="query"
            @focus="isFocus = true"
        />

        <i 
            class="
                bi bi-x 
                opacity-50 hover:opacity-100 
                cursor-pointer text-3xl
                -my-3
            "
            @click="isFocus = false"
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