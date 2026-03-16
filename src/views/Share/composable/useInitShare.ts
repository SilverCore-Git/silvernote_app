import { type Ref, unref } from 'vue';
import { api_url } from "@/assets/ts/backend_link";
import type { Note, User } from '@/assets/ts/type';
import useUser from '@/composables/useUser';
import useToken from '@/composables/useToken';

const { getUserByUUID } = useUser();

export default 
function useFetchShare()
{
    

    let req = 0; 
    let _uuid: string = '';
    let _passwd: Ref<string> | string = '';
    let _state: ShareStateRefs | undefined;

    interface ShareStateRefs {
        note: Ref<Note | undefined>;
        users: Ref<User[]>;
        error: Ref<string>;
        loaded: Ref<boolean>;
        need_passwd: Ref<boolean>;
        editable: Ref<boolean>;
        title: Ref<string | undefined>;
        icon: Ref<string | undefined>;
    }

    async function executeFetch(): Promise<{ closeSocket: () => void } | undefined>
    {
        
        return
        if (!_state) return;

        const { note, users, error, loaded, need_passwd, editable, title, icon } = _state;
        console.log(title, icon);
        
        const passwordValue = unref(_passwd);

        if (req > 0 && error.value === "Une erreur réseau est survenue.") error.value = '';

        try {

            const response = await fetch(`${api_url}/api/share/${_uuid}?passwd=${passwordValue}`, { 
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await useToken()}`
                }
            });

            const shareData = await response.json();

            
            if (shareData.error)
            {
                error.value = shareData.message;
                loaded.value = true;
                return;
            }

            if (shareData.expired)
            {
                error.value = 'Ce partage a expiré.';
                loaded.value = true;
                return;
            }

            if (shareData.banned)
            {
                error.value = 'Vous êtes bannis de ce partage.';
                loaded.value = true;
                return;
            }

            
            if (shareData.need == 'passwd')
            {

                req++;
                need_passwd.value = true;
                loaded.value = true;
                
                if (req > 1) {
                    error.value = 'Mot de passe incorrect.';
                }
                return;

            }

            
            if (shareData.success)
            {
                
                need_passwd.value = false;
                error.value = ''; 

                note.value = shareData.note;
                editable.value = shareData.editable;
                if (shareData.user_id === window.localStorage.getItem('user_id'))
                {
                    editable.value = true;
                }

                const owner_user = await getUserByUUID(shareData.user_id, 'owner');
                if (owner_user && !users.value.some(u => u.user_id === owner_user.user_id)) {
                    users.value.push(owner_user);
                }

                loaded.value = true;

                if (!note.value) return;

                // const { closeSocket } = await initSocket({
                //     room: note.value.uuid,
                //     users,
                //     icon,
                //     title,
                //     userId: shareData.user_id
                // })

                if (shareData.visitor && shareData.visitor.length > 0)
                {

                    const usersFetched = await Promise.all(
                        shareData.visitor
                            .filter((id: string) => id != shareData.user_id)
                            .map((id: string) => getUserByUUID(id, 'visitor'))
                    );

                    users.value.push(
                        ...usersFetched.filter((u: any) => Boolean(u))
                    );

                }

                return {
                    closeSocket: () => {}
                }

            }

        } catch (e) {
            console.error("Erreur fetch share:", e);
            loaded.value = true;
        }

    }


    async function init(
        uuid: string, 
        passwd: Ref<string> | string,
        state: ShareStateRefs
    ): Promise<{ closeSocket: () => void } | undefined>
    {
        
        _uuid = uuid;
        _passwd = passwd;
        _state = state;
        req = 0;

        return await executeFetch();

    }

    async function verifyPasswd() {
        await executeFetch();
    }

    return {
        init,
        verifyPasswd
    };

}