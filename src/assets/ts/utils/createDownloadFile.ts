export default function (c: { content: string, fileName: string, type: string })
{
    const blob = new Blob([c.content], { type: c.type });

    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = c.fileName;

    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
    URL.revokeObjectURL(url);
}