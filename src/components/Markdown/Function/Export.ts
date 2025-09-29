import utils from "@/assets/ts/utils";
import { editor } from "../Editor";


export const download = async ({
    format,
    title
}: {
    format: 'pdf' | 'html',
    title: string;
}): Promise<void> => 

{

    const fileName = title.replace(' ', '_') + '.' + format;
    const html = editor.value?.getHTML();
    const text = editor.value?.getText();
    if (!html || !text) return;

    if (format == 'html') 
    {
        utils.downloadHtmlFile(
            html,
            fileName
        )
    }
    else if (format == 'pdf')
    {
        utils.exportMarkdownToPDF(
            text,
            fileName
        )
    }

}

