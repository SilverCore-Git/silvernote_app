import utils from "@/assets/ts/utils";
import { Notes, Tags } from "@/assets/ts/database/Var";
import type { Note, Tag } from "@/assets/ts/type";
import { useWSocket } from "@/composables/WSocket";

export default async function
({
  event, 
  onEnd,
  onProgress
}:{
  event: Event, 
  onEnd: () => void,
  onProgress: (current: number, total: number) => void
}): Promise<void>
{

  const input = event.target as HTMLInputElement;

  if (input.files)
  {
    
    const file = input.files[0];

    const reader = new FileReader();

    
    reader.onload = async (e: ProgressEvent<FileReader>) => {

      const contenu = e.target?.result

      if (typeof contenu === "string") {

        try {

          const data = JSON.parse(contenu)

          const [tags_hash_ok, notes_hash_ok, sender_info_hash_ok, data_info_hash_ok] = 
            await Promise.all([
              utils.hash(data.tags).then(h => h === data.hash.tags),
              utils.hash(data.notes).then(h => h === data.hash.notes),
              utils.hash(data.sender_info).then(h => h === data.hash.sender_info),
              utils.hash(data.data_info).then(h => h === data.hash.data_info)
            ]);

          if (tags_hash_ok) console.log('Hash tags ok !'); else console.warn('Hash tags incorect !');
          if (notes_hash_ok) console.log('Hash notes ok !'); else console.warn('Hash notes incorect !');
          if (sender_info_hash_ok) console.log('Hash sender_info ok !'); else console.warn('Hash sender_info incorect !');
          if (data_info_hash_ok) console.log('Hash data_info ok !'); else console.warn('Hash data_info incorect !');

          if (tags_hash_ok && notes_hash_ok && sender_info_hash_ok && data_info_hash_ok) 
          {

            console.log('All hash ok !');
            console.log('Starting eating data...');

            const user_id = window.localStorage.getItem('user_id');

            const BATCH_SIZE = 10;
            const totalCount: number = data.notes.length;

            for (let i = 0; i < data.notes.length; i += BATCH_SIZE)
            {

              const batch = data.notes.slice(i, i + BATCH_SIZE);
              await Promise.all(
                batch.map(async (note: Note) => {
                  note.user_id = user_id!;
                  note.uuid = await utils.UUID();
                  note.id = parseInt(Date.now() + Math.floor(Math.random() * 1000).toString());
                  note._id = undefined;
                  (await useWSocket()).value.emit('note:create', note);
                  Notes.value.push(note);
                })
              );

              onProgress(i, totalCount);
              
            }

            onProgress(totalCount, totalCount);

            for (let i = 0; i < data.tags.length; i += BATCH_SIZE)
            {

              const batch = data.tags.slice(i, i + BATCH_SIZE);
              await Promise.all(
                batch.map(async (tag: Tag) => {
                  tag.user_id = user_id!;
                  tag.uuid = await utils.UUID();
                  tag.id = parseInt(Date.now() + Math.floor(Math.random() * 1000).toString());
                  (await useWSocket()).value.emit('tag:create', tag);
                  Tags.value.push(tag);
                })
              );

            }

          }
          else 
          {
            throw new Error(`Hash not valid.\n\n Hashes:\n  Tags: ${await utils.hash(data.tags)} || ${data.hash.tags}\n  Notes: ${await utils.hash(data.notes)} || ${data.hash.notes}\n  Sender Info: ${await utils.hash(data.sender_info)} || ${data.hash.sender_info}\n  Data Info: ${await utils.hash(data.data_info)} || ${data.hash.data_info}\n\nValidation:\n  Tags OK: ${await utils.hash(data.tags) === data.hash.tags}\n  Notes OK: ${await utils.hash(data.notes) === data.hash.notes}\n  Sender Info OK: ${await utils.hash(data.sender_info) === data.hash.sender_info}\n  Data Info OK: ${await utils.hash(data.data_info) === data.hash.data_info}`)
          }

        } catch (err) {
          return console.error("Une erreur est survenue, step : parse data / eating data / verify hash :", err)
        }

        console.log('Database eat end !');
        onEnd();

      }

    }

    reader.readAsText(file);

  }

}