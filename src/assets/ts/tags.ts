import fs from "fs";
const fsp = fs.promises;
import path from "path";
import { randomUUID } from "crypto";
import type { Tag } from "./types";

export type TagLayout = {
    all: number;
    file: number;
    db: { file: string; value: number; full: boolean }[];
};

class Tags {

    private db_dir_path: string;

    constructor() {
        this.db_dir_path = path.join(__dirname, '../../db');
    }

    private dbPath(user_id: string) {
        return path.join(this.db_dir_path, user_id, 'tags');
    }

    private layoutPath(user_id: string) {
        return path.join(this.dbPath(user_id), 'layout.json');
    }

    private async init_db(user_id: string) {
        const basePath = this.dbPath(user_id);
        const layoutPath = this.layoutPath(user_id);
        const primary_db = path.join(basePath, '20.json');

        const Layout_data: TagLayout = {
            all: 0,
            file: 1,
            db: [{ file: '20.json', value: 0, full: false }]
        };

        if (!fs.existsSync(path.join(this.db_dir_path, user_id))) {
            await fsp.mkdir(path.join(this.db_dir_path, user_id));
        }
        if (!fs.existsSync(basePath)) {
            await fsp.mkdir(basePath);
        }
        if (!fs.existsSync(layoutPath)) {
            await fsp.writeFile(layoutPath, JSON.stringify(Layout_data, null, 2), 'utf-8');
        }
        if (!fs.existsSync(primary_db)) {
            await fsp.writeFile(primary_db, JSON.stringify([]), 'utf-8');
        }
    }

    private async save(data: Tag[], db_path: string) {
        await fsp.writeFile(db_path, JSON.stringify(data, null, 2), 'utf-8');
    }

    private async readFileSafe(filePath: string) {
        try {
            if (fs.existsSync(filePath)) {
                const data = await fsp.readFile(filePath, 'utf-8');
                return JSON.parse(data);
            }
            return [];
        } catch (err) {
            console.error("Erreur lecture fichier :", filePath, err);
            return [];
        }
    }

    public async createTag(tag: Tag) {
        if (!tag.user_id) return { error: true, message: "user_id requis" };
        tag.uuid = tag.uuid || randomUUID();
        tag.created_at = tag.created_at || Date.now();

        await this.init_db(tag.user_id);

        const basePath = this.dbPath(tag.user_id);
        const layoutPath = this.layoutPath(tag.user_id);
        const layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));

        // Vérifier si le tag existe déjà
        for (const file of layout.db) {
            const dbPath = path.join(basePath, file.file);
            const db: Tag[] = await this.readFileSafe(dbPath);
            if (db.some(t => t.uuid === tag.uuid)) {
                return { error: true, message: "Le tag existe déjà", tag };
            }
        }

        // Ajouter dans un fichier non plein
        for (const file of layout.db) {
            if (!file.full) {
                const dbPath = path.join(basePath, file.file);
                const db: Tag[] = await this.readFileSafe(dbPath);
                db.push(tag);
                file.value++;
                file.full = file.value >= 20;
                layout.all++;
                await this.save(db, dbPath);
                await fsp.writeFile(layoutPath, JSON.stringify(layout, null, 2), 'utf-8');
                return { success: true, tag };
            }
        }

        // Créer un nouveau fichier
        const newFile = `${layout.db.length + 20}.json`;
        const dbPath = path.join(basePath, newFile);
        await this.save([tag], dbPath);
        layout.db.push({ file: newFile, value: 1, full: false });
        layout.all++;
        await fsp.writeFile(layoutPath, JSON.stringify(layout, null, 2), 'utf-8');

        return { success: true, tag };
    }

    public async getTagsByUserId(user_id: string) {
        await this.init_db(user_id);
        const basePath = this.dbPath(user_id);
        const layout = JSON.parse(await fsp.readFile(this.layoutPath(user_id), 'utf-8'));

        let allTags: Tag[] = [];
        for (const file of layout.db) {
            const dbPath = path.join(basePath, file.file);
            const tags: Tag[] = await this.readFileSafe(dbPath);
            allTags = allTags.concat(tags);
        }

        return { success: true, tags: allTags };
    }

    public async deleteTagByID(user_id: string, id: number) {
        await this.init_db(user_id);
        const basePath = this.dbPath(user_id);
        const layoutPath = this.layoutPath(user_id);
        const layout: TagLayout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));
        let deleted = false;

        for (const file of layout.db) {
            const dbPath = path.join(basePath, file.file);
            let tags: Tag[] = await this.readFileSafe(dbPath);
            const initialLength = tags.length;
            tags = tags.filter(t => t.id !== id);
            if (tags.length < initialLength) {
                deleted = true;
                file.value = tags.length;
                file.full = tags.length >= 20;
                await this.save(tags, dbPath);
            }
        }

        layout.all = layout.db.reduce((acc, f) => acc + f.value, 0);
        await fsp.writeFile(layoutPath, JSON.stringify(layout, null, 2), 'utf-8');

        if (deleted) return { success: true };
        return { error: true, message: "Tag introuvable" };
    }

    public async clearUserTags(user_id: string) {
        await this.init_db(user_id);
        const basePath = this.dbPath(user_id);
        const layoutPath = this.layoutPath(user_id);
        const layout: TagLayout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));

        for (const file of layout.db) {
            const dbPath = path.join(basePath, file.file);
            await this.save([], dbPath);
            file.value = 0;
            file.full = false;
        }

        layout.all = 0;
        await fsp.writeFile(layoutPath, JSON.stringify(layout, null, 2), 'utf-8');
        return { success: true };
    }

    public async updateTag(tag: Tag) {
        if (!tag.uuid || !tag.user_id) return { error: true, message: "uuid et user_id requis" };

        await this.init_db(tag.user_id);
        const basePath = this.dbPath(tag.user_id);
        const layoutPath = this.layoutPath(tag.user_id);
        const layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));

        for (const file of layout.db) {
            const dbPath = path.join(basePath, file.file);
            let tags: Tag[] = await this.readFileSafe(dbPath);

            const index = tags.findIndex(t => t.uuid === tag.uuid);
            if (index !== -1) {
                tags[index] = { ...tags[index], ...tag };
                await this.save(tags, dbPath);
                return { success: true, tag: tags[index] };
            }
        }

        return { error: true, message: "Tag introuvable" };
    }


}

export default new Tags();
