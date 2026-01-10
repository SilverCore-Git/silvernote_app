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
        { note, ref }: 
        { note :ComputedRef<Note | undefined>, ref: Ref<HTMLElement | null> }
    ) => {

        if (!ref.value) {
            return console.error("Emoji picker non chargé.");
        }

        const picker = new EmojiButton({
            position: 'bottom-start',
            autoHide: true,
            showPreview: true,
            theme: window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
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
            // custom: [
            //     { name: "test", emoji: "data:image/png;base64,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" }
            // ]
        });

        picker.on('emoji', (emoji: { emoji: string; name: string }) => {
            if (!note.value) return;
            note.value.icon = utils.emojiToBase64(emoji.emoji);
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