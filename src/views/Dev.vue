<template>

    <header class="flex flex-row relative" style="padding-top: calc(1rem + env(safe-area-inset-top)/2);">
        <div class="left-arrow absolute left-4" :class="hitbox ? 'bg-red-600' : ''" @click="router.push('/')"></div>
    </header>

    <div class="flex justify-start items-center mt-12 ml-4 mr-4">

        <section>

            <h1
                style="font-family: 'Montserrat'" 
                class="text-2xl mb-1 font-bold"
            >Informations systeme</h1>

            <ul class="ml-1">
                <li>Platform = {{ platform }}</li>
                <li>Lang = {{ lang }}</li>
                <li>isOnline ? = {{ isOnline }}</li>
                <li>userAgent = {{ userAgent }}</li>
            </ul>

            <h1
                style="font-family: 'Montserrat'" 
                class="text-2xl mb-1 font-bold mt-5"
            >Informations app</h1>

            <ul class="ml-1">
                <li>Version = {{ version }}</li>
            </ul>

            <h1
                style="font-family: 'Montserrat'" 
                class="text-2xl mb-1 font-bold mt-5"
            >Db</h1>

            <ul class="ml-1">

                <li class="flex flex-col">
                    <button @click="load_template_db" class="second">load db template</button>
                    <span>Attention cela réinitialise la db !</span>
                </li>
            </ul>


        </section>

    </div>

</template>


<script lang="ts" setup>

    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router';
    import { version } from '../../package.json';

    import back from '../assets/ts/backend_link.ts';
    import db from '../assets/ts/database';
    import { init_theme } from '../assets/ts/theme';
    onMounted(() => { init_theme() });

    import { hitbox as if_hitbox} from '../assets/ts/settings';

    let hitbox: boolean;
    onMounted(async () => { hitbox = await if_hitbox() })

    const router = useRouter();

    const userAgent: string = navigator.userAgent;

    const platform: string = navigator.platform;

    const lang: string = navigator.language;

    const isOnline: boolean = navigator.onLine;

    const load_template_db = async () => {
        await db.reset();
        await db.add_notes(back.dev_db.notes);
        await db.add_tags(back.dev_db.tags);
        alert('c fini')
    }

</script>