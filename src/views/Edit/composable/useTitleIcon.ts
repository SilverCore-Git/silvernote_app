import { ref } from "vue";

const title = ref<string | undefined>(undefined);
const icon = ref<string | undefined>(undefined);

const updateTitle = (newTitle: string) => {
    title.value = newTitle;
};

const updateIcon = (newIcon: string) => {
    icon.value = newIcon; 
};

export {
    title,
    icon,
    updateTitle,
    updateIcon
}
