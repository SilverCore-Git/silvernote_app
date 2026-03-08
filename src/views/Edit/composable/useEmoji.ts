import utils from "@/assets/ts/utils";
import { EmojiButton } from "@joeattardi/emoji-button";
import { type ComputedRef, type Ref } from "vue";


export default function
()
{

    const init_emoji_picker = (
        { note, ref }: 
        { 
            note : ComputedRef<any> | Ref<any>,
            ref: Ref<HTMLElement | null> 
        }
    ) => {

        if (!ref.value) {
            return console.error("Emoji picker non chargé.");
        }

        const theme = window.localStorage.getItem('theme');

        const picker = new EmojiButton({
            position: 'bottom-start',
            autoHide: true,
            showPreview: true,
            theme: theme == 'dark' ? 'dark' : theme == 'light' ?  'light' : 'auto',
            i18n: {
                search: 'Rechercher...',
                categories: {
                recents: 'Récents',
                smileys: 'Émoticônes et émotions',
                people: 'Personnes et corps',
                animals: 'Animaux et nature',
                food: 'Nourriture et boissons',
                activities: 'Activités',
                travel: 'Voyages et lieux',
                objects: 'Objets',
                symbols: 'Symboles',
                flags: 'Drapeaux',
                custom: 'Personnalisé',
                },
                notFound: 'Aucun emoji trouvé',
            },
        });

        picker.on('emoji', (emoji: { emoji: string; name: string }) => {
            if (!note.value) return;
            note.value.icon = utils.emojiToBase64(emoji.emoji);
        });

        ref.value.addEventListener('click', () => {
            picker.togglePicker(ref.value!);
        });

    }

    return {
        init_emoji_picker
    }

}