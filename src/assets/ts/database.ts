import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

import notes from '../notes.json';

export interface Note {
  id: number;
  pinned: boolean;
  simply_edit: boolean;
  title: string;
  content: string;
  date: string;
  tags: string[];
};

interface NotesDB extends DBSchema {
  notes: {
    key: number;
    value: Note;
  };
};

class Database {

    private dbPromise: Promise<IDBPDatabase<NotesDB>>;

    constructor(initialNotes?: Note[]) {

        this.dbPromise = openDB<NotesDB>('notes-db', 1, {

        upgrade(db) {

            if (!db.objectStoreNames.contains('notes')) {

            const store = db.createObjectStore('notes', { keyPath: 'id' });

            if (initialNotes) {

                for (const note of initialNotes) {
                store.add(note);
                };

            };

            };

        }

        });

    };

    async getAll(): Promise<Note[]> {

        const db = await this.dbPromise;
        return db.getAll('notes');

    };

    async save(note: Note): Promise<void> {

        const db = await this.dbPromise;
        await db.put('notes', note);

    };

    async saveContent(content: string, id: number): Promise<void> {

        const db = await this.dbPromise;
        const note = await db.get('notes', id);

        if (note) {
        note.content = content;
        await db.put('notes', note);
        };

    };

    async delete(id: number): Promise<void> {

        const db = await this.dbPromise;
        await db.delete('notes', id);

    };

    async create(note: Note): Promise<void> {

        const db = await this.dbPromise;
        const existing = await db.get('notes', note.id);

        if (existing) {
        throw new Error(`Note avec l'id ${note.id} existe déjà.`);
        };

        await db.add('notes', note);

    };

    async getNote(id: number): Promise<Note | undefined> {
        const db = await this.dbPromise;
        const note = await db.get('notes', id);
        return note;
    }

};


export default new Database(notes);
