import type { Ref } from "vue";
import useUser from "../useUser";
import { wsocket } from "./useWebSocket";
import type { User } from "@/assets/ts/type";

const { getUserByUUID } = useUser();

const useUsers = ( users: Ref<User[]> ) => {

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
        wsocket.on("new_user", onNewUser);
    };

    const close = () => {
        wsocket.off("new_user", onNewUser);
    };

    return {
        start,
        close,
    };
    
};

export { useUsers };
