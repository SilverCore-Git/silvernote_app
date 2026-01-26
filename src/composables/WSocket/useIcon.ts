import { watch, type Ref } from "vue";
import { wsocket } from "./useWebSocket";

let iconValue: any;

const useIcon = () => {

    const updateIcon = (icon: string) => {
        iconValue.value = icon;
        wsocket.emit('icon-update', icon);
    }

    const createIconAutoSync = (icon: Ref<string | undefined>) =>
    {

        iconValue = icon;
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

        let firstEmit: number = 0;

        const socketHandler = (newIcon: string) =>
        {

            if (firstEmit === 0 && newIcon === "") return;
            firstEmit++;

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
