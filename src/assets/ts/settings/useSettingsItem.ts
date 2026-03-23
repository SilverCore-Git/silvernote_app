import { ref, watch, nextTick, type Ref } from "vue";
import { sdb, type Settings } from "./settingsDB";
import { useUser } from "@clerk/vue";

const settingsCache: Partial<Record<Settings, {
    Item: Ref<any>,
    isLoaded: Ref<boolean>
}>> = {};


const useSettingsItem = (item: Settings, defaultValue: any) => {
    
    const { user, isLoaded: clerkReady } = useUser();
    
    if (!settingsCache[item]) 
    {

        settingsCache[item] = {
            Item: ref<any>(undefined),
            isLoaded: ref<boolean>(false)
        };

        watch([clerkReady, user], async ([ready, currentUser]) => {

            if (ready && currentUser)
            {

                const cacheEntry = settingsCache[item]!;
                
                const value = await sdb.get(currentUser, item);
                
                if (value === undefined || value === null) 
                {
                    cacheEntry.Item.value = defaultValue;
                    await sdb.set(currentUser, item, defaultValue);
                } 
                else 
                {
                    cacheEntry.Item.value = value;
                }

                await nextTick();

                watch(cacheEntry.Item, async (newVal) => {
                    await sdb.set(currentUser, item, newVal);
                }, { deep: true });

                cacheEntry.isLoaded.value = true;

            }

        }, { immediate: true });

    }

    return {
        Item: settingsCache[item]!.Item,
        isLoaded: settingsCache[item]!.isLoaded
    };
    
};

export default useSettingsItem;