import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from "vue"
import { sdb, type Settings } from "./settingsDB";


const settingsCache: Partial<Record<Settings, {
    Item: Ref<any>,
    isLoaded: Ref<boolean>,
    subscribers: number
}>> = {};


const useSettingsItem = (item: Settings, defaultValue: any) => {
    
    if (!settingsCache[item]) 
    {

        settingsCache[item] = {
            Item: ref<any>(undefined),
            isLoaded: ref<boolean>(false),
            subscribers: 0
        };

        
        (async () => {
            
            const cacheEntry = settingsCache[item]!;
            const value = await sdb.get(item);
            
            if (value === undefined || value === null) 
            {
                await sdb.set(item, defaultValue);
                cacheEntry.Item.value = defaultValue;
            } 
            else 
            {
                cacheEntry.Item.value = value;
            }

            await nextTick();

            watch(cacheEntry.Item, async (newVal) => {
                await sdb.set(item, newVal);
            }, { deep: true });

            cacheEntry.isLoaded.value = true;

        })();

    }

    const entry = settingsCache[item]!;

    onMounted(() => {
        entry.subscribers++;
    });

    onUnmounted(() => {
        entry.subscribers--;
    });

    return {
        Item: entry.Item,
        isLoaded: entry.isLoaded
    };
    
}

export default useSettingsItem;