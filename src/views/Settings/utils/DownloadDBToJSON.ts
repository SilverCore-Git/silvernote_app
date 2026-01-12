import { Notes, Tags } from "@/assets/ts/database/Var";
import utils from "@/assets/ts/utils";

export default 
async function
()
{

    const tags = Tags.value;
    const notes = Notes.value;

    const json_file = {
        tags,
        notes,
        hash: {
            tags: await utils.hash(tags),
            notes: await utils.hash(notes),
        }
    };

    try {

        const blob = new Blob([JSON.stringify(json_file, null, 2)], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const lien = document.createElement('a');
        lien.href = url;
        lien.download = 'mes_data_silvernote.json';

        document.body.appendChild(lien); // création d'un <a> invisible
        lien.click(); // simulation du click
        document.body.removeChild(lien); // suprésion du <a>
        URL.revokeObjectURL(url);

    }

    catch (err) {
        throw new Error(`Une erreur est survenur lors de la préparation du téléchargement de la db : ${err}`);
    }

}