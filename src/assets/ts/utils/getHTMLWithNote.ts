import type { Note } from "../type";
import { version } from '@/../package.json';

import Basic from '@/components/Markdown/css/basic.css?inline';
import ToDoList from '@/components/Markdown/css/ToDoList.css?inline';
import Table from '@/components/Markdown/css/Table.css?inline';

const css = `
    ${Basic}
    ${ToDoList}
    ${Table}
`

export default function(note: Note, user?: any): string {

    const formattedDate = new Date(
        note.updated_at || Date.now()
    ).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html lang="fr">

<!-- ${JSON.stringify(user)} -->

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${note.title}</title>
    ${ note.icon !== '' ? `<link rel="icon" href="${note.icon}" />` : '' }
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        ${css}
        @media print {
            @page {
                margin: 2cm;
                size: A4;
            }
            body {
                background: white !important;
                color: black !important;
            }
            .container {
                width: 100% !important;
                max-width: none !important;
                animation: none !important;
            }
        }
        :root {
            --btn: #F28C28;
            --bg: #FFF8F0;
            --text: #000000;
            --text-dim: #6e6e6ea2;
            --border: rgba(242, 140, 40, 0.2);

            --bg2: #EFE9E0;
            --white: #FFFFFF;
            --text-strong: #2A2724;
            --text-little: #8D857E;
            --shadow: #322B241A; 
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg: #121212;
                --text: #ffffff;
                --text-dim: #A0A0A0;
                --border: rgba(242, 140, 40, 0.2);

                --bg2: #1E1E1E; 
                --white: #252525;
                --text-strong: #FFFFFF; 
                --text-little: #A0A0A0; 
                --shadow: #000000CC;
            }
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }

        .container {
            max-width: 800px;
            width: 100%;
            animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        header {
            margin-bottom: 40px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 20px;
        }

        .meta {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }

        .icon-wrapper {
            font-size: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: var(--text);
            margin-top: 10px;
        }

        .date {
            font-size: 0.9rem;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .content {
            padding-top: 20px;
            padding-bottom: 40px;
            min-height: 400px;
        }

        .content p {
            min-height: 20px;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 0.8rem;
            color: var(--text-dim);
        }

        .brand {
            color: var(--btn);
            font-weight: 600;
            text-decoration: none;
        }

        @media print {
            body { background: white; color: black; padding: 0; }
            .content { border: none; box-shadow: none; padding: 0; color: black; }
            .brand, .icon-wrapper { color: black; border-color: #eee; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="meta">
                <div class="icon-wrapper">
                    ${ note.icon !== '' ? `<img src="${note.icon}" width="64" height="64"/>` : '' }
                    <h1>${note.title}</h1>
                </div>
            </div>
        </header>

        <main class="content prose ProseMirror tiptap">${note.content.replace(/\n/g, '<br>') }</main>

        <footer class="footer">
            Exporté depuis <a href="https://www.silvernote.fr" class="brand">Silvernote</a> v${version} <span style="padding-right: 4px; padding-left: 4px">|</span> Le ${formattedDate}
        </footer>
    </div>
</body>
</html>
    `;
}