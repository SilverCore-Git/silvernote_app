import { api_url } from "@/assets/ts/backend_link";
import { useToken } from "@/composables/useToken";
import type { Chat } from "./SilverIAtypes";
import { ref, type Ref } from "vue";

class useChat
{

    public chat: Ref<Chat | null> = ref(null);

    public async create (user: any)
    {

        const res = await fetch(`${api_url}/api/ai/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useToken().token.value}`
            },
            body: JSON.stringify({ user })
        });

        if (res.ok) {
            const data = await res.json();
            this.chat.value = data.session;
            return data;
        }

    }

    public async close(uuid: string)
    {
        const res = await fetch(`${api_url}/api/ai/close`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useToken().token.value}`,
                'credentials': 'include'
            },
            body: JSON.stringify({ uuid })
        });

        const data = await res.json();
        return data;

    }

}

export default new useChat();