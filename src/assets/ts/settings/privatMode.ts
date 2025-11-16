import { ref } from "vue";
import db from "./settingsDB";

const IsPrivate = ref<boolean | undefined>(undefined);

const init = async () => {
    if (await db.get('private')) {
        IsPrivate.value = await db.get('private');
    }
    else {
        IsPrivate.value = false;
    }
};
init().then(() => console.log(IsPrivate.value || 'non'));

const setPrivate = async (value: boolean) => {
    await db.set('private', value);
    IsPrivate.value = value;
}

export {
    IsPrivate,
    setPrivate
}