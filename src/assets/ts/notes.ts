import fs from "fs";
const fsp = fs.promises;
import type { Note, Layout } from "./types";
import path from "path";
import { randomUUID } from "crypto";



const fileLocks = new Map<string, Promise<any>>();

async function acquireLock(filePath: string) {
    while (fileLocks.has(filePath)) {
        await fileLocks.get(filePath);
    }
    const lockPromise = Promise.resolve();
    fileLocks.set(filePath, lockPromise);
    return lockPromise;
}

function releaseLock(filePath: string) {
    fileLocks.delete(filePath);
}


function isNodeError(error: unknown): error is NodeJS.ErrnoException {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error
    );
}



class Notes {

    private db_dir_path: string;

    constructor() {
        this.db_dir_path = path.join(__dirname, '../../db');
    }

    private dbPath(user_id: string) {
        return path.join(this.db_dir_path, user_id, 'notes');
    }

    private layoutPath(user_id: string) {
        return path.join(this.dbPath(user_id), 'layout.json');
    }

    private async init_db(user_id: string) {
        const basePath = this.dbPath(user_id);
        const layoutPath = this.layoutPath(user_id);
        const primary_db = path.join(basePath, '20.json');

        const Layout_data: Layout = {
            all: 0,
            file: 1,
            db: [{ file: '20.json', value: 0, full: false }]
        };

        try {
            await fsp.access(path.join(this.db_dir_path, user_id));
        } catch {
            await fsp.mkdir(path.join(this.db_dir_path, user_id));
        }

        try {
            await fsp.access(basePath);
        } catch {
            await fsp.mkdir(basePath);
        }

        try {
            await fsp.access(layoutPath);
        } catch {
            await fsp.writeFile(layoutPath, JSON.stringify(Layout_data), 'utf-8');
        }

        try {
            await fsp.access(primary_db);
        } catch {
            await fsp.writeFile(primary_db, JSON.stringify([]), 'utf-8');
        }
    }

    private async save(data: Note[] | Layout, db_path: string) {
        await fsp.writeFile(db_path, JSON.stringify(data, null, 2), 'utf-8');
    }

    private async readFileSafe(filePath: string) {
        try {
            await fsp.access(filePath);
            const data = await fsp.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            if (isNodeError(err) && err.code !== 'ENOENT') {
                console.error("Erreur lecture fichier :", filePath, err);
            }
            return [];
        }
    }

    public async createNote(note: Note) {
        if (!note.user_id) return { error: true, message: "user_id requis" };
        note.uuid = note.uuid || randomUUID();
        note.created_at = note.created_at || Date.now();

        await this.init_db(note.user_id);

        const basePath = this.dbPath(note.user_id);
        const layoutPath = this.layoutPath(note.user_id);

        await acquireLock(layoutPath);
        try {
            const layout: Layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));

            for (const file of layout.db) {
                const dbPath = path.join(basePath, file.file);
                const db: Note[] = await this.readFileSafe(dbPath);
                
                if (db.some(n => n.uuid === note.uuid)) {
                    return { error: true, message: "La note existe déjà", note };
                }

                if (!file.full) {
                    await acquireLock(dbPath);
                    try {
                        const db_notes: Note[] = await this.readFileSafe(dbPath);
                        db_notes.push(note);
                        file.value++;
                        file.full = file.value >= 20;
                        layout.all++;
                        await this.save(db_notes, dbPath);
                        await this.save(layout, layoutPath);
                        return { success: true, note };
                    } finally {
                        releaseLock(dbPath);
                    }
                }
            }

            const newFile = `${layout.db.length + 20}.json`;
            const dbPath = path.join(basePath, newFile);

            await acquireLock(dbPath);
            try {
                await this.save([note], dbPath);
                layout.db.push({ file: newFile, value: 1, full: false });
                layout.all++;
                await this.save(layout, layoutPath);
                return { success: true, note };
            } finally {
                releaseLock(dbPath);
            }
        } finally {
            releaseLock(layoutPath);
        }
    }


    public async updateNote(note: Note) {
        if (!note.uuid || !note.user_id) return { error: true, message: "uuid et user_id requis" };

        await this.init_db(note.user_id);
        const basePath = this.dbPath(note.user_id);
        const layoutPath = this.layoutPath(note.user_id);

        await acquireLock(layoutPath);
        try {
            const layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));

            for (const file of layout.db) {
                const dbPath = path.join(basePath, file.file);

                await acquireLock(dbPath);
                try {
                    let notes: Note[] = await this.readFileSafe(dbPath);
                    const index = notes.findIndex(n => n.uuid === note.uuid);

                    if (index !== -1) {
                        notes[index] = { ...notes[index], ...note };
                        await this.save(notes, dbPath);
                        return { success: true, note: notes[index] };
                    }
                } finally {
                    releaseLock(dbPath);
                }
            }
        } finally {
            releaseLock(layoutPath);
        }

        return { error: true, message: "Note introuvable" };
    }


    public async getNoteByUUID(uuid: string) {
        const users = await fsp.readdir(this.db_dir_path);
        for (const user of users) {
            const basePath = this.dbPath(user);
            const layoutPath = this.layoutPath(user);
            
            try {
                await fsp.access(layoutPath);
                const layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));
                for (const file of layout.db) {
                    const dbPath = path.join(basePath, file.file);
                    const notes: Note[] = await this.readFileSafe(dbPath);
                    const found = notes.find(n => n.uuid === uuid);
                    if (found) return { success: true, note: found };
                }
            } catch (error) {
                if (isNodeError(error) && error.code !== 'ENOENT') {
                    console.error("Erreur lors de la recherche de la note :", error);
                }
            }
        }
        return { error: true, message: "Note introuvable" };
    }

    public async getNoteByUserId(user_id: string) {
        await this.init_db(user_id);
        const basePath = this.dbPath(user_id);
        const layoutPath = this.layoutPath(user_id);

        let allNotes: Note[] = [];

        await acquireLock(layoutPath);
        try {
            const layout: Layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));
            for (const file of layout.db) {
                const dbPath = path.join(basePath, file.file);
                const notes: Note[] = await this.readFileSafe(dbPath);
                allNotes = allNotes.concat(notes);
            }
        } finally {
            releaseLock(layoutPath);
        }
        
        return { success: true, notes: allNotes };
    }

    public async clearUserNotes(user_id: string) {
        await this.init_db(user_id);
        const basePath = this.dbPath(user_id);
        const layoutPath = this.layoutPath(user_id);

        await acquireLock(layoutPath);
        try {
            const layout: Layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));

            for (const file of layout.db) {
                const dbPath = path.join(basePath, file.file);
                await acquireLock(dbPath);
                try {
                    await this.save([], dbPath);
                    file.value = 0;
                    file.full = false;
                } finally {
                    releaseLock(dbPath);
                }
            }

            layout.all = 0;
            await this.save(layout, layoutPath);
            return { success: true };
        } finally {
            releaseLock(layoutPath);
        }
    }

    public async deleteNoteByUUID(user_id: string, uuid: string) {
        await this.init_db(user_id);
        const basePath = this.dbPath(user_id);
        const layoutPath = this.layoutPath(user_id);

        let deleted = false;

        await acquireLock(layoutPath);
        try {
            const layout: Layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));
            for (const file of layout.db) {
                const dbPath = path.join(basePath, file.file);

                await acquireLock(dbPath);
                try {
                    let notes: Note[] = await this.readFileSafe(dbPath);
                    const initialLength = notes.length;
                    notes = notes.filter(n => n.uuid !== uuid);
                    
                    if (notes.length < initialLength) {
                        deleted = true;
                        file.value = notes.length;
                        file.full = notes.length >= 20;
                        await this.save(notes, dbPath);
                    }
                } finally {
                    releaseLock(dbPath);
                }
            }

            layout.all = layout.db.reduce((acc, f) => acc + f.value, 0);
            await this.save(layout, layoutPath);

            if (deleted) return { success: true };
            return { error: true, message: "Note introuvable" };
        } finally {
            releaseLock(layoutPath);
        }
    }
}

export default new Notes();