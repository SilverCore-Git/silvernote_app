import utils from "../utils";

export default function parseNotionHTML
(html: string): { title: string; icon: string; content: string } 
{

    let res: { title: string; icon: string; content: string };

    try {

        res = {
            title: '',
            icon: '',
            content: ''
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        
        const emoji_icon_span = doc.querySelector('span.icon');

        if (emoji_icon_span)
        {
            res.icon = utils.emojiToBase64(emoji_icon_span.textContent as string);
        }

        const title = doc.querySelector('h1.page-title');

        if (title)
        {
            res.title = title.textContent as string;
        }

        const content = doc.querySelector('div.page-body');

        if (content) 
        {
            res.content = content.innerHTML;
        }

    }

    catch(err) {
        throw new Error(`Error on parse html from notion : ${err}`);
    }

    return res;

}
