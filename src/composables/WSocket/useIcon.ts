import { watch, type Ref } from "vue";
import { wsocket } from "./useWebSocket";


const useIcon = () => {

    const updateIcon = (icon: string) => {
        wsocket.emit('icon-update', icon);
    }

    const createIconAutoSync = (icon: Ref<string | undefined>) =>
    {

        let onUpdate = false;

        const stopWatch = watch(
            () => icon.value,
            (newVal, oldVal) => {

                if (newVal === oldVal || onUpdate) return;

                onUpdate = true;
                wsocket.emit('icon-update', newVal);

                setTimeout(() => {
                    onUpdate = false;
                }, 200);

            }
        );

        const socketHandler = (newIcon: string) =>
        {

            onUpdate = true;
            icon.value = newIcon;

            setTimeout(() => {
                onUpdate = false;
            }, 200);

        };

        wsocket.on('icon-update', socketHandler);

        const stopIconAutoSync = () =>
        {
            stopWatch();
            wsocket.off('icon-update', socketHandler);
        };

        return {
            stopIconAutoSync
        };

    };

    return {
        updateIcon,
        createIconAutoSync
    }

}

export {
    useIcon
}
