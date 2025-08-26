    import fs from "fs";
    const fsp = fs.promises;
    import type { Note, Layout } from "./types";
    import path from "path";
    import { randomUUID } from "crypto";

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

            if (!fs.existsSync(path.join(this.db_dir_path, user_id))) {
                await fsp.mkdir(path.join(this.db_dir_path, user_id));
            }

            if (!fs.existsSync(basePath)) {
                await fsp.mkdir(basePath);
            }

            if (!fs.existsSync(layoutPath)) {
                await fsp.writeFile(layoutPath, JSON.stringify(Layout_data), 'utf-8');
            }

            if (!fs.existsSync(primary_db)) {
                await fsp.writeFile(primary_db, JSON.stringify([]), 'utf-8');
            }
        }

        private async save(data: Note[], db_path: string) {
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
        


        public async createNote(note: Note) {

            if (!note.user_id) return { error: true, message: "user_id requis" };
            note.uuid = note.uuid || randomUUID();
            note.created_at = note.created_at || Date.now();

            await this.init_db(note.user_id);

            const basePath = this.dbPath(note.user_id);
            const layoutPath = this.layoutPath(note.user_id);
            const layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));

            // Vérifier si la note existe déjà
            for (const file of layout.db) {
                const dbPath = path.join(basePath, file.file);
                const db: Note[] = await this.readFileSafe(dbPath);
                if (db.some(n => n.uuid === note.uuid)) {
                    return { error: true, message: "La note existe déjà", note };
                }
            }

            // Trouver un fichier où ajouter
            for (const file of layout.db) {
                if (!file.full) {
                    const dbPath = path.join(basePath, file.file);
                    const db: Note[] = await this.readFileSafe(dbPath);
                    db.push(note);
                    file.value++;
                    file.full = file.value >= 20;
                    layout.all++;
                    await this.save(db, dbPath);
                    await this.save(layout, layoutPath);
                    return { success: true, note };
                }
            }

            // Sinon créer un nouveau fichier
            const newFile = `${layout.db.length + 20}.json`;
            const dbPath = path.join(basePath, newFile);
            await this.save([note], dbPath);
            layout.db.push({ file: newFile, value: 1, full: false });
            layout.all++;
            await this.save(layout, layoutPath);

            return { success: true, note };
            
        }


        public async getNoteByUUID(uuid: string) {
            const users = await fsp.readdir(this.db_dir_path);
            for (const user of users) {
                const basePath = this.dbPath(user);
                const layoutPath = this.layoutPath(user);
                if (!fs.existsSync(layoutPath)) continue;

                const layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));
                for (const file of layout.db) {
                    const dbPath = path.join(basePath, file.file);
                    const notes: Note[] = await this.readFileSafe(dbPath);
                    const found = notes.find(n => n.uuid === uuid);
                    if (found) return { success: true, note: found };
                }
            }
            return { error: true, message: "Note introuvable" };
        }

        public async getNoteByUserId(user_id: string) {
            await this.init_db(user_id);
            const basePath = this.dbPath(user_id);
            const layout = JSON.parse(await fsp.readFile(this.layoutPath(user_id), 'utf-8'));

            let allNotes: Note[] = [];
            for (const file of layout.db) {
                const dbPath = path.join(basePath, file.file);
                const notes: Note[] = await this.readFileSafe(dbPath);
                allNotes = allNotes.concat(notes);
            }

            return { success: true, notes: allNotes };
        }

        public async updateNote(note: Note) {
            if (!note.uuid || !note.user_id) return { error: true, message: "uuid et user_id requis" };

            await this.init_db(note.user_id);
            const basePath = this.dbPath(note.user_id);
            const layout = JSON.parse(await fsp.readFile(this.layoutPath(note.user_id), 'utf-8'));

            for (const file of layout.db) {
                const dbPath = path.join(basePath, file.file);
                let notes: Note[] = await this.readFileSafe(dbPath);

                const index = notes.findIndex(n => n.uuid === note.uuid);
                if (index !== -1) {
                    notes[index] = { ...notes[index], ...note };
                    await this.save(notes, dbPath);
                    return { success: true, note: notes[index] };
                }
            }

            return { error: true, message: "Note introuvable" };
        }

        public async clearUserNotes(user_id: string) {
            await this.init_db(user_id);
            const basePath = this.dbPath(user_id);
            const layoutPath = this.layoutPath(user_id);

            const layout: Layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));

            for (const file of layout.db) {
                const dbPath = path.join(basePath, file.file);
                await this.save([], dbPath); // correct, tableau de notes
                file.value = 0;
                file.full = false;
            }

            layout.all = 0;
            await fsp.writeFile(layoutPath, JSON.stringify(layout, null, 2), 'utf-8'); // layout sauvegardé correctement
            return { success: true };
        }

        public async deleteNoteByUUID(user_id: string, uuid: string) {
            await this.init_db(user_id);
            const basePath = this.dbPath(user_id);
            const layoutPath = this.layoutPath(user_id);

            const layout: Layout = JSON.parse(await fsp.readFile(layoutPath, 'utf-8'));
            let deleted = false;

            for (const file of layout.db) {
                const dbPath = path.join(basePath, file.file);
                let notes: Note[] = await this.readFileSafe(dbPath);
                const initialLength = notes.length;
                notes = notes.filter(n => n.uuid !== uuid);
                if (notes.length < initialLength) {
                    deleted = true;
                    file.value = notes.length;
                    file.full = notes.length >= 20;
                    await this.save(notes, dbPath); // correct, tableau de notes
                }
            }

            layout.all = layout.db.reduce((acc, f) => acc + f.value, 0);
            await fsp.writeFile(layoutPath, JSON.stringify(layout, null, 2), 'utf-8'); // layout sauvegardé correctement

            if (deleted) return { success: true };
            return { error: true, message: "Note introuvable" };
        }


    }

    export default new Notes();
