import type { Ref } from 'vue';

import DOMPurify from 'dompurify';
import type { Note } from './type';
import db from './database';


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

    public clean_html(html: string): string {
        return DOMPurify.sanitize(html);
    }

    public htmlToText(html: string): string {
 
        const div = document.createElement("div");
        div.innerHTML = this.clean_html(html);

        div.querySelectorAll("br").forEach(br => br.replaceWith("\n"));

        div.querySelectorAll("p, div, span, li, ul, ol, h1, h2, h3, h4, h5, h6, header, footer, main, section, article, aside, nav, script, style, img, video, audio, source, picture, figure, figcaption, table, thead, tbody, tfoot, tr, td, th, form, input, button, select, option, textarea, label, iframe, canvas, svg, pre, code, blockquote, cite, address, details, summary, mark, time, abbr, b, i, strong, em, small, sub, sup, br, hr").forEach(el => {
            el.insertAdjacentText("afterend", "\n");
        });

        return div.textContent?.trim() || "";

    }

    public async hash(text: any) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    public get_text_color(bgColor: string): string {

        bgColor = bgColor.replace('#', '');

        if (bgColor.length !== 6) return '#000'; 

        const r = parseInt(bgColor.slice(0, 2), 16);
        const g = parseInt(bgColor.slice(2, 4), 16);
        const b = parseInt(bgColor.slice(4, 6), 16);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

        return luminance > 186 ? '#000000' : '#FFFFFF';

    }


}

const init_notes = async (list_notes: Ref<Note[] | undefined>): Promise<void> => {
    list_notes.value = await db.getAll('notes') || null;
    const sort_notes = list_notes.value.sort((a: Note, b: Note) => {
        if (a.pinned === b.pinned) {
            return b.id - a.id;
        }
            return a.pinned ? -1 : 1;
    });
    list_notes.value = sort_notes;
}

export default new utils();
export {
    init_notes
}