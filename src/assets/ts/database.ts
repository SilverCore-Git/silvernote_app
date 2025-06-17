import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Note, Tag } from './type';

//import back from './backend_link';

// const notes: Note[] = back.db?.notes;
// const tags: Tag[] = back.db?.tags;

interface NotesDB extends DBSchema {
    notes: {
        key: number;
        value: Note;
    };
    tags: {
        key: number;
        value: Tag;
    }
}

class Database {
    private dbPromise: Promise<IDBPDatabase<NotesDB>>;

    constructor(initialNotes?: Note[], initialTags?: Tag[]) {
        this.dbPromise = openDB<NotesDB>('notes-db', 2, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('notes')) {
                    const store = db.createObjectStore('notes', { keyPath: 'id' });
                    if (initialNotes) {
                        for (const note of initialNotes) {
                            store.add(note);
                        }
                    }
                }

                if (!db.objectStoreNames.contains('tags')) {
                    const tagsStore = db.createObjectStore('tags', { keyPath: 'id' });
                    if (initialTags) {
                        for (const tag of initialTags) {
                            tagsStore.add(tag);
                        }
                    }
                };
            }
        });
    }

    public async getAll<T extends 'notes' | 'tags'>(type: T): Promise<T extends 'notes' ? Note[] : Tag[]> {
        const db = await this.dbPromise;
        return db.getAll(type) as any;
    }

    public async save(note: Note): Promise<void> {
        const db = await this.dbPromise;
        await db.put('notes', note);
    }

    public async saveTags(tags: number[], id: number): Promise<void> {
        const db = await this.dbPromise;
        const note = await db.get('notes', id);
        if (note) {
            note.tags = tags;
            await db.put('notes', note);
        }
    }

    public async saveContent(content: string, id: number): Promise<void> {
        const db = await this.dbPromise;
        const note = await db.get('notes', id);
        if (note) {
            note.content = content;
            await db.put('notes', note);
        }
    }

    public async saveTitle(title: string, id: number): Promise<void> {
        const db = await this.dbPromise;
        const note = await db.get('notes', id);
        if (note) {
            note.title = title;
            await db.put('notes', note);
        }
    }

    public async togle_pinned(id: number): Promise<void> {
        const db = await this.dbPromise;
        const note = await db.get('notes', id);
        if (note) {
            note.pinned = !note.pinned;
            await db.put('notes', note);
        }
    }

    public async delete(id: number): Promise<void> {
        const db = await this.dbPromise;
        await db.delete('notes', id);
    }

    public async delete_tag(id: number): Promise<void> {
        const db = await this.dbPromise;
        await db.delete('tags', id);
    }

    public async create(note: Note): Promise<{ id: number }> {
        const db = await this.dbPromise;
        const all_notes = await db.getAll('notes');
        note.id = all_notes.length + 1;
        await db.add('notes', note);
        return { id: note.id };
    }

    public async create_tag(tag: Tag): Promise<void> {
        const db = await this.dbPromise;
        const all_tags = await db.getAll('tags');
        tag.id = all_tags.length + 1;
        await db.add('tags', tag);
    }

    public async getNote(id: number): Promise<Note | undefined> {
        const db = await this.dbPromise;
        return db.get('notes', id);
    }
}

export default new Database(
    // notes,
    // tags,
    undefined,
    undefined
);
