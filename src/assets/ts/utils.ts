import { ref } from 'vue';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DOMPurify from 'dompurify';
import { api_url } from './backend_link';


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

    public getRandomHexColor(): string {
        const randomInt = Math.floor(Math.random() * 0xffffff);
        const hex = randomInt.toString(16).padStart(6, '0');
        return `#${hex}`;
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

    public async UUID(): Promise<string> {
        const res = await fetch(`${api_url}/api/uuid`);
        const data: { id:string } = await res.json();
        return data.id;
    }

    public emojiToBase64 (emoji: string, size = 64, offsetY = 0.05): string {

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d')!;
        ctx.font = `${size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(emoji, size / 2, size / 2 + size * offsetY);

        return canvas.toDataURL('image/png');

    }

    public downloadHtmlFile(html: string, filename = "document.html") {
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    public async downloadHtmlToPdf(html: string, fileName = "document.pdf") {

        const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": import.meta.env.VITE_PDFSHIFT_KEY,
            },
            body: JSON.stringify({
                source: html,
                landscape: false,
                use_print: true,
            }),
        });

        if (!response.ok) {
            throw new Error(`Erreur API PDFShift : ${response.statusText}`);
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);

    }

}

const loaded = ref<boolean>(false);


export default new utils();
export {
    loaded
}