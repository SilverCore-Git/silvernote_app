import path from 'path';
import fs, { existsSync } from 'fs';
const fsp = fs.promises;

import utils from './utils';
import type { Session, User } from './types';

class Database {

    private db_dir_path: string;
    private db_users: string;
    private db_sessions: string;

    constructor () {

        this.db_dir_path = path.join(__dirname, '../../db');
        this.db_users = path.join(this.db_dir_path, 'users.json');
        this.db_sessions = path.join(this.db_dir_path, 'sessions.json');
        
        this.init();

    }

    private async init () {

        if (!fs.existsSync(this.db_dir_path)) await fsp.mkdir(this.db_dir_path);
        if (!fs.existsSync(this.db_users)) await fsp.writeFile(this.db_users, JSON.stringify([], null, 2), 'utf-8');
        if (!fs.existsSync(this.db_sessions)) await fsp.writeFile(this.db_sessions, JSON.stringify([], null, 2), 'utf-8');

    }

    private async get ( db_type: "user" | "sessions" ): Promise<any> {

        if (db_type == 'user') {

            const data = await fsp.readFile(this.db_users);
            const data_parse: User[] = JSON.parse(`${data}`);
            return data_parse;

        }

        if (db_type == 'sessions') {

            const data = await fsp.readFile(this.db_sessions);
            const data_parse: User[] = JSON.parse(`${data}`);
            return data_parse;

        }

    }

    private async save ( db_type: "user" | "sessions", data: User[] | Session[] ): Promise<any> {

        if (db_type == 'user') {

            return await fsp.writeFile(this.db_users, JSON.stringify(data), 'utf-8');

        }

        if (db_type == 'sessions') {

            return await fsp.writeFile(this.db_sessions, JSON.stringify(data), 'utf-8');

        }

    }





    public async new_session ( userID: string ): Promise<Session> {

        const uuid = utils.uuid();
        const date = new Date();

        const session: Session = {
            id: uuid,
            start: date,
            end: date,
            user: userID,
            state: 'open'
        }

        const db: Session[] = await this.get('sessions');
        
        db.push(session);

        await this.save('sessions', db);

        return session;

    }


}

export default new Database()