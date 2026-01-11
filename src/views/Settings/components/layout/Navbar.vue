<template>

    <div
        class="
            h-screen
            p-4 min-w-65
        "
    >

       <ul class="w-full flex flex-col gap-2">

            <li
                @click="router.push('/')"
                class="relative flex gap-2 mb-8"
            >
                <div class="left-arrow" />
                Accueil
            </li>

            <li 
                v-for="value in 5"
                class="li"
                :class="false ? 'bg-[var(--btn)] text-white' : ''"
            >
                <i 
                    :class="false ? '' : 'text-[var(--btn)]'"
                    class="bi bi-people-fill text-xl"
                />
                <span>Notes partagées</span>
            </li>

        </ul>

    </div>

</template>

<script lang="ts" setup>
import BackBtn from '@/components/backBtn.vue';
import { useRouter } from 'vue-router';

const router = useRouter();


</script>

<style scoped>

.li {
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
    transition: all 0.3s;
    :where(& > :not(:last-child)) {
        --tw-space-x-reverse: 0;
        margin-inline-start: calc(calc(var(--spacing) * 2) /* 0.5rem = 8px */ * var(--tw-space-x-reverse));
        margin-inline-end: calc(calc(var(--spacing) * 2) /* 0.5rem = 8px */ * calc(1 - var(--tw-space-x-reverse)));
    };
}

.li:not(.nohover2):hover {
    padding-left: 1.5em;
}

ul li {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

ul hr {
    opacity: 50%;
}

ul li:not(.nohover):hover {
  background-color: rgba(131, 131, 131, 0.15);
}

</style>