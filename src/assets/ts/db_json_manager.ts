import fs from "fs";
const fsp = fs.promises;
import path from "path";
import { randomUUID } from "crypto";

interface Item { 

    user_id: string;
    uuid: string;
    note_uuid: string;

    parms: {
        life: number; // age en milliseconde
        passwd?: string;
        editable: boolean;
    }

    created_at: string;

    visitor: string[]; // user ids
    banned: string[]; // user ids

}

class JsonListManager<T extends Item> {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = path.join(__dirname, '../../db/', filePath);
    }

    private async init() {
        if (!fs.existsSync(this.filePath)) {
            await fsp.mkdir(path.dirname(this.filePath), { recursive: true });
            await fsp.writeFile(this.filePath, JSON.stringify([], null, 2), "utf-8");
        }
    }

    private async readFileSafe(): Promise<T[]> {
        try {
            await this.init();
            const data = await fsp.readFile(this.filePath, "utf-8");
            return JSON.parse(data);
        } catch (err) {
            console.error("Erreur lecture fichier :", err);
            return [];
        }
    }

    private async save(data: T[]): Promise<void> {
        await fsp.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
    }

    public async getAll(): Promise<T[]> {
        return await this.readFileSafe();
    }

    public async getByUUID(uuid: string): Promise<T | undefined> {
        const items = await this.readFileSafe();
        return items.find(item => item.uuid === uuid);
    }

    public async push(item: T): Promise<T> {
        const items = await this.readFileSafe();
        item.uuid = item.uuid || randomUUID();
        items.push(item);
        await this.save(items);
        return item;
    }

    public async update(item: T): Promise<{ success: boolean; item?: T; message?: string }> {
        if (!item.uuid) return { success: false, message: "uuid requis" };

        const items = await this.readFileSafe();
        const index = items.findIndex(i => i.uuid === item.uuid);

        if (index === -1) return { success: false, message: "Élément introuvable" };

        items[index] = { ...items[index], ...item };
        await this.save(items);
        return { success: true, item: items[index] };
    }

    public async delete(uuid: string): Promise<boolean> {
        const items = await this.readFileSafe();
        const newItems = items.filter(i => i.uuid !== uuid);
        const changed = newItems.length !== items.length;
        if (changed) await this.save(newItems);
        return changed;
    }

    public async clear(): Promise<void> {
        await this.save([]);
    }
}

export default JsonListManager;
