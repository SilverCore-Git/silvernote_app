import { type Ref } from "vue";
import useWSocket from "./useWebSocket";


const createAIListener = async (
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

    const wsocket = await useWSocket();

    const titleHandler = (data: { title: string, room: string }) => {

        if (data.room !== room) return;
          
        try {
              
            if (title.value !== undefined) {
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

            if (icon.value !== undefined) {
                icon.value = data.icon;
            }

        }
        catch (e) {
            console.error("Erreur lors de la mise à jour de l'icon : ", e);
        }

    };

    wsocket.value.on('ai-title-update', titleHandler)
    wsocket.value.on('ai-icon-update', iconHandler)

    const stopAIListener = () =>
    {
        wsocket.value.off('ai-title-update', titleHandler)
        wsocket.value.off('ai-icon-update', iconHandler)
    };

    return {
        stopAIListener
    };

}

export {
    createAIListener
}