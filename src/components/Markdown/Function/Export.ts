import utils from "@/assets/ts/utils";
import db from "@/assets/ts/database/database";
import { editor } from '../Editor';
import type { Note } from "@/assets/ts/type";

import ToDoList_css from '../css/ToDoList.css?inline';
import basic_css from '../css/basic.css?inline';


export const download = async ({
    format,
    id
}: {
    format: 'pdf' | 'html',
    id: number;
}): Promise<void> => 

{

    const note = await db.getNote(id);
    const html = editor.value?.getHTML();
    if (!note || !html) return;

    const fileName = note.title.replace(' ', '_') + '.' + format;    
    const htmlContent = HtmlFileModel({ ...note, content: html });

    if (format == 'html') 
    {
        utils.downloadHtmlFile(
            htmlContent,
            fileName
        )
    }
    else if (format == 'pdf')
    {
        utils.downloadHtmlToPdf(
            htmlContent,
            fileName
        )
    }

}



const HtmlFileModel = ({ icon, title, content }: Note): string => {
    return `
        <!doctype html>
        <html lang="fr">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            :root {
                --btn: #F28C28;
                --bg: #FFF8F0;
                --bg2: #fff5e8;
                --text: #3B3B3B;
                --text-strong: rgb(51, 51, 51);
                --shadow: #33333346;
            }
            body {
                font-family: 'Inter', sans-serif;
                background-color: #FFF8F0;
                color: #3B3B3B;
                display: flex;
                justify-content: center;
                align-items: start;
                min-height: 100vh;
                margin: 0;
                padding: 2rem;
            }
            .container {
                max-width: 52em;
                width: 100%;
            }

            .flex-raw {
                display: flex;
                width: 100%;
                justify-content: start;
                align-items: center;
            }
            ${ToDoList_css}
            ${basic_css}
        </style>
        </head>
        <body>

        <div class="container tiptap">

            <div class="flex-raw">
                <img 
                    style="margin-right: 12px; width: 3em; height: 3em;"
                    src="${icon}"
                >
                <h1 class="h1">${title}</h1>
            </div>

            <p>
                ${content}
            </p>

        </div>

        </body>
        </html>
    `;
}
