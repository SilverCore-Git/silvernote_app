export default function (c: { json: any, fileName: string })
{
    const blob = new Blob([JSON.stringify(c.json)], { type: 'application/snote' });

    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = c.fileName;

    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
    URL.revokeObjectURL(url);
}