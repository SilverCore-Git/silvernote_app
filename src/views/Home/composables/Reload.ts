import { nextTick, ref } from "vue";
import InitDB from '@/assets/ts/database/init';
import db from '@/assets/ts/database/database';


const view_notes = ref<boolean>(true);
const isRotating = ref<boolean>(false);



async function reload_list
(a: 'just_view' | 'local' | 'cloud')
{

        if (isRotating.value) return;
        
        isRotating.value = true;
        
        if (a == 'just_view') {
            view_notes.value = false;
            await nextTick();
            view_notes.value = true;
        }

        view_notes.value = false;

        if (a == 'local')
        {
            await nextTick();

            await InitDB.init_local_tags();
            await InitDB.init_local_notes();
            await InitDB.init_shared_notes();

            console.log('Reload local db');
        }


        if (a == 'cloud')
        {
            await nextTick();

            async function fetchCloud()
            {
                await db.reset().then(async () => {
                    await InitDB.init_cloud_tags();
                    await InitDB.init_cloud_notes();
                });
                await InitDB.init_shared_notes();
            }

            await fetchCloud().then(async () => {

                await InitDB.init_local_tags();
                await InitDB.init_local_notes();

                console.log('Reload db');

            })

        }

        setTimeout(async () => {
            await nextTick();
            view_notes.value = true;
        }, 100)

        setTimeout(() => {
            isRotating.value = false;
        }, 400);

}


export {
    reload_list,
    view_notes,
    isRotating
}