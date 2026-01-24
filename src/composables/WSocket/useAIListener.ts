import { type Ref } from "vue";
import { wsocket } from "./useWebSocket";


const createAIListener = (
    {
        room,
        title,
        icon
    }:
    {
        room: string,
        title: Ref<string | undefined>,
        icon: Ref<string | undefined>
    }
) => {

    const titleHandler = (data: { title: string, room: string }) => {

        if (data.room !== room) return;
          
        try {
              
            if (title.value) {
                title.value = data.title;
            }

        }
        catch (e) {
            console.error("Erreur lors de la mise à jour du titre : ", e);
        }

    };

    const iconHandler = (data: { icon: string, room: string }) => {

        if (data.room !== room) return;

        try {
              
            if (icon.value) {
                icon.value = data.icon;
            }

        }
        catch (e) {
            console.error("Erreur lors de la mise à jour de l'icon : ", e);
        }

    };

    wsocket.on('ai-title-update', titleHandler)
    wsocket.on('ai-icon-update', iconHandler)

    const stopAIListener = () =>
    {
        wsocket.off('ai-title-update', titleHandler)
        wsocket.off('ai-icon-update', iconHandler)
    };

    return {
        stopAIListener
    };

}

export {
    createAIListener
}