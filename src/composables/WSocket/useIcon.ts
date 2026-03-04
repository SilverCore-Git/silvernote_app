import { watch, type Ref } from "vue";
import useWSocket from "./useWebSocket";

const useIcon = async () => {

    const wsocket = await useWSocket();

    const createIconAutoSync = (icon: Ref<string | undefined>) => {
        
        let onUpdate = false;
        let firstEmit = 0;
        
        const stopWatch = watch(
            () => icon.value,
            (newVal, oldVal) => {
                if (newVal === oldVal || onUpdate) return;

                onUpdate = true;
                wsocket.value.emit('icon-update', newVal);

                setTimeout(() => {
                    onUpdate = false;
                }, 200);
            }
        );

        const socketHandler = (newIcon: string) => {
            if (firstEmit === 0 && newIcon === "") return;
            firstEmit++;

            onUpdate = true;
            icon.value = newIcon;

            setTimeout(() => {
                onUpdate = false;
            }, 200);
        };

        wsocket.value.on('icon-update', socketHandler);

        const stopIconAutoSync = () => {
            stopWatch();
            wsocket.value.off('icon-update', socketHandler);
        };

        return {
            stopIconAutoSync
        };

    };

    return {
        createIconAutoSync
    }

}

export { useIcon }