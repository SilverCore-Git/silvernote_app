import { computed, ref } from "vue";
import type { NotificationItem } from "./NotifTypes";
import { api_url } from "@/assets/ts/backend_link";
import useToken from "@/composables/useToken";

const notifications = ref<NotificationItem[] | undefined>(undefined);
const todayNotifications = computed(() => {

    if (!notifications.value) return [];
    
    const today = new Date().toLocaleDateString();
    
    return notifications.value.filter(n => {
        if (!n.date) return false; 
        return new Date(n.date).toLocaleDateString() === today;
    }) || [];

});

const NotifImportant = computed(
    () => todayNotifications.value.filter(n => !n.readBy.includes(localStorage.getItem('user_id') || ''))
);


const initNotifications = async () => {

    let notif: NotificationItem[] = [];

    try {

        const res = await fetch(`${api_url}/api/notifications`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await useToken()}`
            }
        });

        if (res.ok)
        {

            const data = await res.json();
            notif = data;

            notif.sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            });

        }

    } catch (e) {
        console.error(e);
    }

    notifications.value = notif || [];

};


export { 
    notifications,
    todayNotifications,
    NotifImportant,
    initNotifications
};