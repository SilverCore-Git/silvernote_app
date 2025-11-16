import { openDB, type DBSchema, type IDBPDatabase } from "idb";


interface SettingsSchema extends DBSchema {
    settings: {
        key: string;
        value: any;
    };
}


export class SettingsDB {

    private static instance: SettingsDB;
    private db!: IDBPDatabase<SettingsSchema>;

    private constructor() {}

    static async getInstance() {
        if (!SettingsDB.instance) {
            const instance = new SettingsDB();
            await instance.init();
            SettingsDB.instance = instance;
        }
        return SettingsDB.instance;
    }

    private async init() {
        this.db = await openDB<SettingsSchema>("silvernote-db", 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("settings")) {
                    db.createObjectStore("settings");
                }
            }
        });
    }

    async get(key: string) {
        return await this.db.get("settings", key);
    }

    async set(key: string, value: any) {
        return await this.db.put("settings", value, key);
    }

    async update(key: string, partialValue: Record<string, any>) {
        const existing = await this.get(key);
        const updated = { ...existing, ...partialValue };
        return await this.set(key, updated);
    }

    async delete(key: string) {
        return await this.db.delete("settings", key);
    }

    async getAll() {
        return await this.db.getAll("settings");
    }

}
