import { openDB, type DBSchema, type IDBPDatabase } from "idb";

type Settings = 'private_mode' | 'show_all_news';

interface SettingsSchema extends DBSchema {
    settings: {
        key: Settings;
        value: any;
    };
}

class SettingsDB {

    private dbPromise: Promise<IDBPDatabase<SettingsSchema>>;

    constructor() {
        this.dbPromise = openDB<SettingsSchema>("silvernote-db", 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("settings")) {
                    db.createObjectStore("settings");
                }
            }
        });
    }

    public async get(key: Settings) {
        const db = await this.dbPromise;
        return await db.get("settings", key);
    }

    public async set(key: Settings, value: any) {
        const db = await this.dbPromise;
        return await db.put("settings", value, key);
    }

    public async update(key: Settings, partialValue: Record<string, any>) {
        const existing = await this.get(key) || {};
        const updated = { ...existing, ...partialValue };
        return await this.set(key, updated);
    }

    public async delete(key: Settings) {
        const db = await this.dbPromise;
        return await db.delete("settings", key);
    }

    public async getAll() {
        const db = await this.dbPromise;
        return await db.getAll("settings");
    }

}


const sdb = new SettingsDB();
export {
    sdb,
    type Settings
}
