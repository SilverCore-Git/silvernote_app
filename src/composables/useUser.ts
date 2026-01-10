import { api_url } from "@/assets/ts/backend_link";
import type { User } from "@/assets/ts/type";


export default function
()
{


    const getUserByUUID = async (user_id: string, type: 'owner' | 'visitor'): Promise<User> => {
    
        const data = await fetch(`${api_url}/api/user/by/id/${user_id}`, {
            credentials: 'include'
        }).then(res => res.json());
        return { ...data, type };

    }

    return {
        getUserByUUID
    }

}