import getToken from "@/composables/useToken";
import { api_url } from "../../backend_link";


export default async function (note: any)
{

    const message = `Context: ${note.title} - ${note.content.substring(0, 300)}
        Task: Return ONLY the emojiapi.dev URL (unicode, size 128px) for an icon illustrating this.
        Format: https://emojiapi.dev/api/v1/{unicode}/128.png`;

    const res = await fetch(`${api_url}/api/ai/send_message?model=gpt-4o-mini`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`
        },
        body: JSON.stringify({ message })
    }).then(res => res.json());

    return res.response.content;

}
