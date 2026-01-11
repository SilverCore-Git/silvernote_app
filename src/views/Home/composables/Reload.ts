import { nextTick, ref } from "vue";
import InitDB from '@/assets/ts/database/init';


const view_notes = ref<boolean>(true);
const isRotating = ref<boolean>(false);



async function reload_list
(a: 'just_view' | 'cloud')
{

        if (isRotating.value) return;
        
        isRotating.value = true;
        
        if (a == 'just_view') {
            view_notes.value = false;
            await nextTick();
            view_notes.value = true;
        }

        view_notes.value = false;

        if (a == 'cloud')
        {
            await nextTick();

            await Promise.all([
                InitDB.init_cloud_tags(),
                InitDB.init_cloud_notes(),
                InitDB.init_shared_notes()
            ])

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