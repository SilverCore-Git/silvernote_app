import fs from "fs";
const fsp = fs.promises;
import type { Note, Layout } from "./types";
import path from "path";

class Notes {

    private db_dir_path: string;

    constructor () {
        this.db_dir_path = path.join(__dirname, '../../db');
    }

    private dbPath(user_id: string) {
        return path.join(this.db_dir_path, user_id, 'notes');
    }

    private async init_db (user_id: string) {

        const _path: string = this.dbPath(user_id);
        const layout: string = path.join(_path, 'layout.json');
        const primary_db: string = path.join(_path, '20.json');

        const Layout_data: Layout = {
            all: 0,
            file: 1,
            db: [
                {
                    file: '20.json',
                    value: 0,
                    full: false
                }
            ]
        }

        if (!fs.existsSync(_path)) await fsp.mkdir(_path);
        if (!fs.existsSync(layout)) await fsp.writeFile(JSON.stringify(Layout_data), layout);
        if (!fs.existsSync(primary_db)) await fsp.writeFile(JSON.stringify([]), primary_db);

    }

    private async save(data: Note[], db_path: string) {
        return await fsp.writeFile(db_path, JSON.stringify(data, null, 2), 'utf-8');
    }

    private async push(user_id: string, notes: Note[]) {

        const _path: string = this.dbPath(user_id);
        const layout_path: string = path.join(_path, 'layout.json');

        const layoutData = await fsp.readFile(layout_path, 'utf-8');
        const layout = JSON.parse(layoutData);

        let remainingNotes = [...notes];

        for (const file of layout.db) {

            if (file.full) continue;

            const db_path = path.join(_path, file.file);
            const dbData = await fsp.readFile(db_path, 'utf-8');
            const db: Note[] = JSON.parse(dbData);

            const spaceLeft = 20 - file.value;
            const toAdd = remainingNotes.slice(0, spaceLeft);

            db.push(...toAdd);
            await this.save(db, db_path);

            file.value += toAdd.length;
            layout.all += toAdd.length;
            file.full = file.value >= 20;

            remainingNotes = remainingNotes.slice(toAdd.length);
            if (remainingNotes.length === 0) break;

        }

        // Créer de nouveaux fichiers si besoin
        while (remainingNotes.length > 0) {

            const newIndex = layout.db.reduce((acc, f) => acc + f.value, 0);
            const newFileName = `${newIndex}.json`;
            const db_path = path.join(_path, newFileName);

            const toAdd = remainingNotes.slice(0, 20);
            await this.save(toAdd, db_path);

            layout.db.push({
                file: newFileName,
                value: toAdd.length,
                full: toAdd.length === 20
            });

            remainingNotes = remainingNotes.slice(toAdd.length);

        }

        // Sauvegarder le layout mis à jour
        await this.save(layout, layout_path);

    }





    public async add (user_id: string, notes: Note[]) {

        const path: string = this.dbPath(user_id);

        if (!fs.existsSync(path)) await this.init_db(user_id);

        

    }

}