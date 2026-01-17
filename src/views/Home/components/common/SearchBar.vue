<template>

    <div class="flex justify-center items-center gap-4">

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

        <div class="md:hidden block">

            <button 
                class="
                    py-2.5 px-3.5
                    border border-(--text-little)
                    rounded-2xl bg-(--white)/50
                    hover:bg-(--white) cursor-pointer
                    transition-all duration-300 ease-in-out
                " 
                v-tooltip.bottom="'Recharger'"
                @click="reload_list('cloud')"
            >

                <div
                    class="
                            bi bi-arrow-clockwise text-(--btn) text-2xl 
                            w-7 h-7 flex justify-center items-center
                        " 
                    :class="[
                        { rotating: isRotating }
                    ]"
                />
                
            </button>

        </div>

    </div>

</template>


<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { isRotating, reload_list } from '../../composables/Reload';

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