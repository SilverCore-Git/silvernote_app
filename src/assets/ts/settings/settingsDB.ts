export type Settings = 'private_mode' | 'show_all_news' | 'aiFunc' | 'snoteWrapped';

export const sdb = {
    
    async get(user: any, key: Settings): Promise<any> 
    {
        if (!user) return undefined;
        const settings = (user.unsafeMetadata?.settings as Record<string, any>) || {};
        return settings[key];
    },

    async set(user: any, key: Settings, value: any) 
    {
        if (!user) return;
        const currentSettings = (user.unsafeMetadata?.settings as Record<string, any>) || {};
        
        return await user.update({
            unsafeMetadata: {
                ...user.unsafeMetadata,
                settings: {
                    ...currentSettings,
                    [key]: value
                }
            }
        });
    }

};