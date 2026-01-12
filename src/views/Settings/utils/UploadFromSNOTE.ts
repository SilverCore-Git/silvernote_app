import utils from "@/assets/ts/utils";
import indexed_db from '@/assets/ts/database/database';
import { Notes, Tags } from "@/assets/ts/database/Var";

export default async function
(event: Event): Promise<void>
{

  const input = event.target as HTMLInputElement;

  if (input.files) {
    
    const file = input.files[0];

    const reader = new FileReader();

    
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const contenu = e.target?.result

      if (typeof contenu === "string") {

        try {

          const data = JSON.parse(contenu)

          const tags_hash_ok: boolean = await utils.hash(data.tags) === data.hash.tags;
          const notes_hash_ok: boolean = await utils.hash(data.notes) === data.hash.notes;
          const sender_info_hash_ok: boolean = await utils.hash(data.sender_info) === data.hash.sender_info;
          const data_info_hash_ok: boolean = await utils.hash(data.data_info) === data.hash.data_info;

          if (tags_hash_ok) console.log('Hash tags ok !'); else console.warn('Hash tags incorect !');
          if (notes_hash_ok) console.log('Hash notes ok !'); else console.warn('Hash notes incorect !');
          if (sender_info_hash_ok) console.log('Hash sender_info ok !'); else console.warn('Hash sender_info incorect !');
          if (data_info_hash_ok) console.log('Hash data_info ok !'); else console.warn('Hash data_info incorect !');

          if (tags_hash_ok && notes_hash_ok && sender_info_hash_ok && data_info_hash_ok) {

            console.log('All hash ok !');
            console.log('Starting eating data...');

            try {
              await indexed_db.create(data.notes);
              Notes.value = data.notes;
            } catch(err) { throw new Error('Erreur lors de la sync des notes.') }

            try {
              await indexed_db.create_tag(data.tags);
              Tags.value = data.tags;
            } catch(err) { throw new Error('Erreur lors de la sync des tags.') }

          }
          else 
          {
            throw new Error(`Hash not valid.\n\n Hashes:\n  Tags: ${await utils.hash(data.tags)} || ${data.hash.tags}\n  Notes: ${await utils.hash(data.notes)} || ${data.hash.notes}\n  Sender Info: ${await utils.hash(data.sender_info)} || ${data.hash.sender_info}\n  Data Info: ${await utils.hash(data.data_info)} || ${data.hash.data_info}\n\nValidation:\n  Tags OK: ${await utils.hash(data.tags) === data.hash.tags}\n  Notes OK: ${await utils.hash(data.notes) === data.hash.notes}\n  Sender Info OK: ${await utils.hash(data.sender_info) === data.hash.sender_info}\n  Data Info OK: ${await utils.hash(data.data_info) === data.hash.data_info}`)
          }

        } catch (err) {
          return console.error("Une erreur est survenue, step : parse data / eating data / verify hash :", err)
        }

        console.log('Database eat end !');

      }
    }

    reader.readAsText(file);

  }

}