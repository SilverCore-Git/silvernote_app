import { watch, type Ref } from "vue";
import { wsocket } from "./useWebSocket";


const useTitle = () => {

    const updateTitle = (title: string) => {
        wsocket.emit('title-update', title);
    }

    const createTitleAutoSync = (title: Ref<string | undefined>) =>
    {
        
        console.log('createTitleAutoSync')

        let onUpdate = false;

        const stopWatch = watch(
            () => title.value,
            (newVal, oldVal) => {

                if (newVal === oldVal || onUpdate) return;

                onUpdate = true;
                wsocket.emit('title-update', newVal);

                setTimeout(() => {
                    onUpdate = false;
                }, 200);

            }
        );

        let firstEmit: number = 0;

        const socketHandler = (newTitle: string) =>
        {

            if (firstEmit === 0 && newTitle === "") return;
            firstEmit++;

            onUpdate = true;
            title.value = newTitle;

            setTimeout(() => {
                onUpdate = false;
            }, 200);

        };

        wsocket.on('title-update', socketHandler);

        const stopTitleAutoSync = () =>
        {
            stopWatch();
            wsocket.off('title-update', socketHandler);
        };

        return {
            stopTitleAutoSync
        };

    };

    return {
        updateTitle,
        createTitleAutoSync
    }

}

export {
    useTitle
}
