import { api_url } from "@/assets/ts/backend_link";
import type { User } from "@/assets/ts/type";


const userCache = new Map<string, User>();


export default function useUser()
{

    const getUserByUUID = async (user_id: string, type?: 'owner' | 'visitor'): Promise<User> => {
        
        if (userCache.has(user_id)) 
        {
            const cachedUser = userCache.get(user_id)!;
            return { ...cachedUser, type: type || cachedUser.type };
        }

        try {
            
            const response = await fetch(`${api_url}/api/user/by/id/${user_id}`, {
                credentials: 'include'
            });

            if (!response.ok) throw new Error('User not found');

            const data = await response.json();
            
            const user: User = { ...data, type };
            userCache.set(user_id, user);

            return user;
        } 
        catch (error) 
        {
            console.error(`Erreur lors de la récupération de l'utilisateur ${user_id}:`, error);
            throw error;
        }

    };

    const clearUserCache = () => userCache.clear();

    return {
        getUserByUUID,
        clearUserCache
    };

}