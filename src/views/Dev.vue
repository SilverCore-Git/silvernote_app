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
                <li>isOnline mode ? = {{ isOnlineMode }}</li>
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

                <li class="flex flex-col">
                    <button @click="download_db" class="second">télécharger la db</button>
                </li>
            </ul>


        </section>

    </div>

</template>


<script lang="ts" setup>

    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router';
    import { version } from '../../package.json';

    import back from '../assets/ts/backend_link';
    import db from '../assets/ts/database';

    import { hitbox as if_hitbox} from '../assets/ts/settings';

    let hitbox: boolean;
    onMounted(async () => { hitbox = await if_hitbox() })

    const router = useRouter();

    const userAgent: string = navigator.userAgent;

    const platform: string = navigator.platform;

    const lang: string = navigator.language;

    const isOnline: boolean = navigator.onLine;
    const isOnlineMode: boolean = localStorage.getItem('online') == 'true';

    const load_template_db = async () => {
        await db.reset();
        await db.add_notes(back.dev_db.notes);
        await db.add_tags(back.dev_db.tags);
        alert('c fini')
    }

    const download_db = async () => {
        const data = { notes: await db.getAll('notes'), tags: await db.getAll('tags') };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const lien = document.createElement('a');
        lien.href = url;
        lien.download = 'db_silvernote.snote';

        document.body.appendChild(lien); // création d'un <a> invisible
        lien.click(); // simulation du click
        document.body.removeChild(lien); // suprésion du <a>
        URL.revokeObjectURL(url);
    } 

</script>