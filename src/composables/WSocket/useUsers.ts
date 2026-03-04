import type { Ref } from "vue";
import useUser from "../useUser";
import type { User } from "@/assets/ts/type";
import useWSocket from "./useWebSocket";

const { getUserByUUID } = useUser();

const useUsers = async ( users: Ref<User[]> ) => {

    const wsocket = await useWSocket();

    const onNewUser = async (userId: string) => {
        
        if (!userId) return;

        const user_visitor = await getUserByUUID(userId, "visitor");
        const user_owner = await getUserByUUID(userId, "owner");

        if (!user_owner || !user_visitor) return;

        const alreadyExists = users.value.some(
            (u) => u.user_id === user_visitor.user_id || u.user_id === user_owner.user_id
        );

        if (alreadyExists) return;

        users.value.push(user_visitor);

    };

    const start = () => {
        wsocket.value.on("new_user", onNewUser);
    };

    const close = () => {
        wsocket.value.off("new_user", onNewUser);
    };

    return {
        start,
        close,
    };
    
};

export { useUsers };
