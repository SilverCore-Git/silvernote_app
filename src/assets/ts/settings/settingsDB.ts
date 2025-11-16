import { openDB, type DBSchema, type IDBPDatabase } from "idb";

interface SettingsSchema extends DBSchema {
    settings: {
        key: string;
        value: any;
    };
}

class SettingsDB {

    private dbPromise: Promise<IDBPDatabase<SettingsSchema>>;

    constructor() {
        this.dbPromise = openDB<SettingsSchema>("silvernote-db-plus", 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("settings")) {
                    db.createObjectStore("settings");
                }
            }
        });
    }

    public async get(key: string) {
        const db = await this.dbPromise;
        return await db.get("settings", key);
    }

    public async set(key: string, value: any) {
        const db = await this.dbPromise;
        return await db.put("settings", value, key);
    }

    public async update(key: string, partialValue: Record<string, any>) {
        const existing = await this.get(key) || {};
        const updated = { ...existing, ...partialValue };
        return await this.set(key, updated);
    }

    public async delete(key: string) {
        const db = await this.dbPromise;
        return await db.delete("settings", key);
    }

    public async getAll() {
        const db = await this.dbPromise;
        return await db.getAll("settings");
    }

}

export default new SettingsDB();
