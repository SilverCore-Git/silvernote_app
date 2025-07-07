import { randomUUID } from 'crypto'

class utils {

    public date (): string {

        const date = new Date();
        const jours = date.getDate().toString().padStart(2, '0');

        const mois = [
            "janvier", "février", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"
        ];

        const moisNom = mois[date.getMonth()];
        const annee = date.getFullYear();

        return `${jours} ${moisNom} ${annee}`;

    }

    public async hash(text: any) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    public uuid () {
        return randomUUID();
    }


}


export default new utils();
