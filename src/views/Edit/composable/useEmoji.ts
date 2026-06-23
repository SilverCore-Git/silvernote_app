import utils from "@/assets/ts/utils";
import { type ComputedRef, type Ref } from "vue";

// Lazy loading de la librairie emoji-button (très lourde : ~500KB)
let EmojiButton: any = null;

async function loadEmojiButton() {
  if (!EmojiButton) {
    const module = await import("@joeattardi/emoji-button");
    EmojiButton = module.EmojiButton;
  }
  return EmojiButton;
}


export default function
()
{

    const init_emoji_picker = async (
        { note, ref }: 
        { 
            note : ComputedRef<any> | Ref<any>,
            ref: Ref<HTMLElement | null> 
        }
    ) => {

        if (!ref.value) {
            return console.error("Emoji picker non chargé.");
        }

        // Charger la librairie dynamiquement
        const EmojiBtn = await loadEmojiButton();

        const theme = window.localStorage.getItem('theme');

        const picker = new EmojiBtn({
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