<template>

    <div class="flex justify-center items-center gap-2">

        <div
            class="
                flex justify-center items-center flex-row 
                border rounded-2xl bg-(--white)/50
                py-3 px-3.5 w-full gap-2.5
                transition-all duration-300 ease-in-out
            "
            :class="isFocus ? 'border-(--btn)' : 'border-gray-300'"
        >

            <i class="bi bi-search opacity-50" />

            <input 
                type="search"
                placeholder="Rechercher une note..."
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
                @click="query = ''; isFocus = false"
            />

    </div>

        <div class="md:hidden block">

            <div
                class="
                    flex flex-row-reverse
                    justify-center items-center
                    bg-(--white)/50
                    border border-gray-300
                    rounded-2xl
                "
            >

                <button 
                    class="
                        bg-(--white)/50 py-2.5 px-3.5
                        hover:bg-(--white) cursor-pointer
                        transition-all duration-300 ease-in-out
                        rounded-2xl text-(--btn)/80 hover:text-(--btn)
                    " 
                    v-tooltip.bottom="'Notifications'"
                    @click="showNotification = !showNotification"
                >

                    <div
                        class="
                                bi text-2xl w-7 h-7
                                flex justify-center items-center
                        "
                        :class="NotifImportant.length > 0 ? 'bi-bell-fill' : 'bi-bell'"
                    />

                </button>

                <div class="h-11 -my-1 border-l border-gray-300" />

                <button 
                    class="
                        bg-(--white)/50 py-2.5 px-3.5
                        hover:bg-(--white) cursor-pointer
                        transition-all duration-300 ease-in-out
                        rounded-2xl hover:text-(--btn)
                    " 
                    :class="isRotating ? 'text-(--btn)' : 'text-(--btn)/80'"
                    v-tooltip.bottom="'Recharger'"
                    @click="reload_list('cloud')"
                >

                    <div
                        class="
                                bi bi-arrow-clockwise text-2xl 
                                w-7 h-7 flex justify-center items-center
                            " 
                        :class="[
                            { rotating: isRotating }
                        ]"
                    />

                </button>

            </div>

        </div>

        <NotificationsPopup
            v-model:show="showNotification"
        />

    </div>

</template>


<script lang="ts" setup>

import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { isRotating, reload_list } from '../../composables/Reload';
import { NotifImportant } from '@/components/notifications/notifications';
import NotificationsPopup from '@/components/notifications/NotificationsPopup.vue';

const router = useRouter();
const query = ref<string>('');
const isFocus = ref<boolean>(false);
const showNotification = ref<boolean>(false);


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

<style scoped>

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  display: none;
}

input[type="search"]::-ms-clear,
input[type="search"]::-ms-reveal {
  display: none;
  width: 0;
  height: 0;
}

</style>