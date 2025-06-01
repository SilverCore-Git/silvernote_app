
import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

import back from './backend_link';

const notes: Note[] = back.db?.notes;
const tags: Tag[] = back.db?.tags;


export interface Note {
    id: number;
    pinned: boolean;
    simply_edit: boolean;
    title: string;
    content: string;
    date: string;
    tags: string[];
};

export interface Tag {
    id: number;
    active: boolean;
    name: string;
};

interface NotesDB extends DBSchema {
    notes: {
        key: number;
        value: Note;
    };
    tags: {
        key: number;
        value: Tag;
    };
};


class Database {

    private dbPromise: Promise<IDBPDatabase<NotesDB>>;

    constructor(initialNotes?: Note[], initialTags?: Tag[]) {

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

                if (!db.objectStoreNames.contains('tags')) {

                    const tagsStore = db.createObjectStore('tags', { keyPath: 'id' });

                    if (initialTags) {
                        for (const tag of initialTags) {
                            tagsStore.add(tag);
                        };
                    };
                };

            }

        });

    };

    async getAll<T extends 'notes' | 'tags'>(type: T): Promise<T extends 'notes' ? Note[] : Tag[]> {

        const db = await this.dbPromise;
        return db.getAll(type) as any;

    }


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

    async togle_pinned(id: number): Promise<void> {

        const db = await this.dbPromise;
        const note = await db.get('notes', id);

        if (note) {
            note.pinned = !note.pinned;
            await db.put('notes', note);
        };

    };

    async delete(id: number): Promise<void> {

        const db = await this.dbPromise;
        await db.delete('notes', id);

    };

    async create(note: Note): Promise<void> {

        const db = await this.dbPromise;
        const all_notes = await db.getAll('notes');

        note.id = all_notes.length + 1;

        await db.add('notes', note);

    };

    async create_tag(tag: Tag): Promise<void> {

        const db = await this.dbPromise;
        const all_tags = await db.getAll('tags');

        tag.id = all_tags.length + 1;

        await db.add('tags', tag);

    };

    async getNote(id: number): Promise<Note | undefined> {
        const db = await this.dbPromise;
        const note = await db.get('notes', id);
        return note;
    }

};


export default  new Database(
                        notes,
                        tags
                    );
