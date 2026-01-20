import { Notes } from "@/assets/ts/database/Var";
import type { Note } from "@/assets/ts/type";
import utils from "@/assets/ts/utils";
import { EmojiButton } from "@joeattardi/emoji-button";
import { type ComputedRef, type Ref } from "vue";



const save_icon = async (icon: string, uuid: string) => {
    const _note = Notes.value.find(note => note.uuid === uuid);
    if (_note) {
        _note.icon = icon;
    }
}


export default function
()
{

    const init_emoji_picker = (
        { note, icon, ref }: 
        { 
            note : ComputedRef<Note | undefined> | Ref<Note | undefined>, 
            icon: Ref<string | undefined>,
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
            icon.value = utils.emojiToBase64(emoji.emoji);
            save_icon(note.value.icon, note.value.uuid);
        });

        ref.value.addEventListener('click', () => {
            picker.togglePicker(ref.value!);
        });

    }

    return {
        init_emoji_picker
    }

}