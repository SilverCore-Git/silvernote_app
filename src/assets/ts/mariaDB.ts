// import mysql from 'mysql2/promise';

// interface Maria_Note {
//   uuid: string;
//   local_id?: number;
//   owner_id: string;
//   title?: string;
//   content?: string;
//   pinned: boolean;
//   type?: string;
//   date?: string;
//   created_at?: Date;
// }

// export class NotesDatabase {
        
//     private pool: mysql.Pool;

//     constructor() {

//         this.pool = mysql.createPool({
        
//             host: 'localhost',
//             user: 'notes_user',
//             password: 'ton_mot_de_passe',
//             database: 'silvernote',
//             waitForConnections: true,
//             connectionLimit: 10,
//             queueLimit: 0,
        
//         });
    
//     }

//     async createNote(note: Maria_Note): Promise<number> {

//         const [result] = await this.pool.query<mysql.ResultSetHeader>(
//             `INSERT INTO notes (uuid, owner_id, title, content, pinned, type, date) 
//             VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             [note.uuid, note.owner_id, note.title, note.content, note.pinned, note.type, note.date]
//         );

//         return result.insertId;
    
//     }

    
//     async getNotes(): Promise<Maria_Note[]> {
        
//         const [rows] = await this.pool.query<Maria_Note[]>('SELECT * FROM notes');
    
//         return rows;
    
//     }

//     async getNoteByUserId(id: string): Promise<Maria_Note | null> {

//         const [rows] = await this.pool.query<Maria_Note[]>('SELECT * FROM notes WHERE owner_id = ?', [id]);
    
//         return rows.length > 0 ? rows[0] : null;
    
//     }
    
//     async getNoteByUUID(uuid: string): Promise<Maria_Note | null> {

//         const [rows] = await this.pool.query<Maria_Note[]>('SELECT * FROM notes WHERE uuid = ?', [uuid]);
    
//         return rows.length > 0 ? rows[0] : null;
    
//     }

    
//     async updateNote(uuid: string, fields: Partial<Maria_Note>): Promise<void> {

//         const keys = Object.keys(fields);
//         const values = Object.values(fields);
//         if (keys.length === 0) return;

//         const setString = keys.map(key => `\`${key}\` = ?`).join(', ');
//         await this.pool.query(`UPDATE notes SET ${setString} WHERE uuid = ?`, [...values, uuid]);
    
//     }

    
//     async deleteNote(uuid: string): Promise<void> {
    
//         await this.pool.query('DELETE FROM notes WHERE uuid = ?', [uuid]);
    
//     }

// }


// export default NotesDatabase;