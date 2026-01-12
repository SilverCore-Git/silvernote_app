import { Notes, Tags } from "@/assets/ts/database/Var";
import { version } from '@/../package.json';
import utils from "@/assets/ts/utils";

export default 
async function
()
{

    const tags = Tags.value;
    const notes = Notes.value;

    const userAgent: string = navigator.userAgent;

    const sender_info = {
        userAgent,
        version,
        with: "blob"
    }

    const data_info = {
        tags_lenght: tags.length,
        notes_lenght: notes.length
    }

    const json_file = {
        snote_file_type: 'db',
        tags,
        notes,
        sender_info,
        data_info,
        hash: {
            tags: await utils.hash(tags),
            notes: await utils.hash(notes),
            sender_info: await utils.hash(sender_info),
            data_info: await utils.hash(data_info)
        }
    };

    try {

        const blob = new Blob([JSON.stringify(json_file)], { type: 'application/snote' });

        const url = URL.createObjectURL(blob);
        const lien = document.createElement('a');
        lien.href = url;
        lien.download = 'mes_data_silvernote.snote';

        document.body.appendChild(lien); // création d'un <a> invisible
        lien.click(); // simulation du click
        document.body.removeChild(lien); // suprésion du <a>
        URL.revokeObjectURL(url);

    }

    catch (err) {
        throw new Error(`Une erreur est survenur lors de la préparation du téléchargement de la db : ${err}`);
    }

}