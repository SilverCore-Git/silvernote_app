import { watch, type Ref } from "vue";
import useWSocket from "./useWebSocket";

const useTitle = async () => {

    const wsocket = await useWSocket();

    const createTitleAutoSync = (title: Ref<string | undefined>) => {
        
        let onUpdate = false;
        let firstEmit = 0;
        
        const stopWatch = watch(
            () => title.value,
            (newVal, oldVal) => {
                if (newVal === oldVal || onUpdate) return;

                onUpdate = true;
                wsocket.value.emit('title-update', newVal);

                setTimeout(() => {
                    onUpdate = false;
                }, 200);
            }
        );

        const socketHandler = (newTitle: string) => {
            if (firstEmit === 0 && newTitle === "") return;
            firstEmit++;

            onUpdate = true;
            title.value = newTitle;

            setTimeout(() => {
                onUpdate = false;
            }, 200);
        };

        wsocket.value.on('title-update', socketHandler);

        const stopTitleAutoSync = () => {
            stopWatch();
            wsocket.value.off('title-update', socketHandler);
        };

        return {
            stopTitleAutoSync
        };
    
    };

    return {
        createTitleAutoSync
    }

}

export { useTitle }