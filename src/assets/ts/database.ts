import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Note, Tag } from './type';
import { api_url } from './backend_link';
import utils from './utils';
import type { Socket } from 'socket.io-client';

// import back from './backend_link';

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

    private async push_note(note: Note, socket?: Socket) {

        if (socket) {
            
            socket.emit('edit_note', { 
                uuid: note.uuid,
                content: note.content,
                title: note.title
            })

        }

        else {
            await fetch(`${api_url}/api/db/update/a/note`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ note }),
            })
        }

    }

    public async getAll<T extends 'notes' | 'tags'>(type: T): Promise<T extends 'notes' ? Note[] : Tag[]> {
        const db = await this.dbPromise;
        return db.getAll(type) as any;
    }

    public async save(note: Note): Promise<void> { // equivelent a un push
        const db = await this.dbPromise;
        await db.put('notes', note);
    }

    public async saveTags(tags: number[], id: number): Promise<void> {
        const db = await this.dbPromise;
        const note = await db.get('notes', id);
        if (note) {
            note.tags = tags;
            this.push_note(note);
            await db.put('notes', note);
        }
    }

    public async saveContent(content: string, id: number, socket: Socket): Promise<void> {
        const db = await this.dbPromise;
        const note = await db.get('notes', id);
        if (note) {
            note.content = content;
            this.push_note(note, socket);
            await db.put('notes', note);
        }
    }

    public async saveTitle(title: string, id: number, socket: Socket): Promise<void> {
        const db = await this.dbPromise;
        const note = await db.get('notes', id);
        if (note) {
            note.title = title;
            this.push_note(note, socket);
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

    public async delete(id: number, noDb?: boolean): Promise<void> {
        const db = await this.dbPromise;
        if (!noDb) {
            await fetch(`${api_url}/api/db/delete/a/note?id=${id}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
        }  
        await db.delete('notes', id);
    }

    public async delete_tag(id: number, noDb?: boolean): Promise<void> {
        const db = await this.dbPromise;

        if (!noDb) {
            await fetch(`${api_url}/api/db/delete/a/tag?id=${id}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
        }  

        await db.delete('tags', id);
    }

    public async create(note: Note): Promise<{ id: number }> {

        const db = await this.dbPromise;
        note.id = Math.floor(Math.random() * (999999999999 - 1000000 + 1)) + 1000;
        note.uuid = await utils.UUID();
        await db.add('notes', note);

        await fetch(`${api_url}/api/db/new/note`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ note }),
        })

        return { id: note.id };

    }

    public async create_tag(tag: Tag, t?: boolean): Promise<void> {
        const db = await this.dbPromise;
        tag.id = Math.floor(Math.random() * (999999999999 - 1000000 + 1)) + 1000;
        if (!t) {
            await fetch(`${api_url}/api/db/new/tag`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ tag }),
            })
        }
        await db.add('tags', tag);
    }

    public async getNote(id: number): Promise<Note | undefined> {
        const db = await this.dbPromise;
        return db.get('notes', id);
    }

    public async add_notes(notes: Note[]): Promise<void> {

        if (notes.length) {

            for (const note of notes) {
                await this.create(note);
            }

        }

    }

    public async add_tags(tags: Tag[]): Promise<void> {

        if (tags.length) {

            for (const tag of tags) {
                await this.create_tag(tag);
            }

        }

    }

    public async save_tag_color(id: number, color: string) {

        if (!color) return;

        const db = await this.dbPromise;
        const tag = await db.get('tags', id);

        if (tag) {

            tag.color = color;
            
            await fetch(`${api_url}/api/db/update/a/tag`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ tag }),
            })

            await db.put('tags', tag);

        }

    }

    public async reset(): Promise<void> {

        const notes = await this.getAll('notes');
        const tags = await this.getAll('tags');

        for (const tag of tags) {
            await this.delete_tag(tag.id, true);
        }

        for (const note of notes) {
            await this.delete(note.id, true);
        }

    }

}

export default new Database(
    // notes,
    // tags,
    undefined,
    undefined
);
