import { ref, watchEffect } from "vue";
import { useUser } from "@clerk/vue";
import { api_url } from "../backend_link";
import type { Plan } from "../type";



export function usePlan() {

    const { user, isLoaded } = useUser();
    const userPlan = ref<Plan | null>(null);
    const loading = ref<boolean>(true);
    const error = ref<string | null>(null);

    async function getUserPlan() {

        if (!user.value?.id) return null;

        try {

            const res = await fetch(`${api_url}/user/plan/get?userId=${user.value.id}`);

            if (!res.ok) throw new Error(`Erreur API (${res.status})`);
            const data = await res.json();
            return data;

        } catch (err: any) {
            console.error("Erreur getUserPlan:", err.message);
            error.value = err.message;
            return null;
        }

    }

    watchEffect(async () => {
        if (isLoaded.value && user.value) {
            loading.value = true;
            userPlan.value = await getUserPlan();
            loading.value = false;
        }
    });


    return { plan: userPlan, loading, error, refresh: getUserPlan };

}
