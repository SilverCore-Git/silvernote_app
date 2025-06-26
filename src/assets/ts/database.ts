import path from 'path';
import fs, { existsSync } from 'fs';
const fsp = fs.promises;

import utils from './utils';
import type { User, Note, Tag, Layout_data } from './types';

class Database {

    private db_path: string;

    constructor () {

        this.db_path = path.join(__dirname, '../../db');
        
        this.init();

    }

    private async init () {

        if (!fs.existsSync(this.db_path)) await fsp.mkdir(this.db_path);

    }

    public async push (
                    notes: Note[], 
                    tags: Tag[], 
                    user: User
                ) 
    {

        // init push
        const db_path: string = path.join(this.db_path, user.sub);
        try {
            if (!fs.existsSync(db_path)) await fsp.mkdir(db_path);
        } catch(err) { console.error('An error occured on init push :', err) };

        // create var
        const notes_db: string = path.join(db_path, 'notes.json');
        const tags_db: string = path.join(db_path, 'tags.json');
        const user_db: string = path.join(db_path, 'user.json');
        const layout: string = path.join(db_path, 'layout.json');
        const hash: string = path.join(db_path, 'hash.json');

        // mk/clean json db for push
        try {
            for ( const path of [ notes_db, tags_db, user_db, layout, hash ] ) {
                await fsp.writeFile(path, JSON.stringify({}), 'utf-8');
            }
        } catch(err) { console.error('An error occured on mk/clean json db :', err) };

        // push data
        try {

            await fsp.writeFile(notes_db, JSON.stringify(notes), 'utf-8');
            await fsp.writeFile(tags_db, JSON.stringify(tags), 'utf-8');
            await fsp.writeFile(user_db, JSON.stringify(user), 'utf-8');

            const layout_data: Layout_data = {
                files: [
                    notes_db,
                    tags_db,
                    user_db,
                    layout,
                    hash
                ],
                notes_lenght: notes.length || -1,
                tags_lenght: tags.length || -1
            }

            const hash_data = {
                user: await utils.hash(user),
                layout: await utils.hash(layout_data),
                tags: await utils.hash(tags),
                notes: await utils.hash(notes)
            }

            await fsp.writeFile(layout, JSON.stringify(layout_data), 'utf-8');
            await fsp.writeFile(hash, JSON.stringify(hash_data), 'utf-8');

        } catch(err) { console.error('An error occured on push data :', err) };

    }

    public get (user: User) {

        const db_path: string = path.join(this.db_path, user.sub);
        if (!existsSync(db_path)) return { notes: {}, tags: {}, hash: {} };

        const notes_db: string = path.join(db_path, 'notes.json');
        const tags_db: string = path.join(db_path, 'tags.json');
        const hash: string = path.join(db_path, 'hash.json');

        return {
            notes: fsp.readFile(notes_db, 'utf-8') || {},
            tags: fsp.readFile(tags_db, 'utf-8') || {},
            hash: fsp.readFile(hash, 'utf-8') || {}
        }

    }

}

export default new Database()