import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Note, Tag } from '../type';
import { api_url } from '../backend_link';
import utils from '../utils';
import type { Socket } from 'socket.io-client';


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

    public async saveIcon(icon: string, id: number): Promise<void> {
        const db = await this.dbPromise;
        const note = await db.get('notes', id);
        if (note) {
            note.icon = icon;
            this.push_note(note);
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
            const uuid = (await this.getNote(id))?.uuid;
            await fetch(`${api_url}/api/db/delete/a/note?uuid=${uuid}`, {
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
        const tag = await db.get('tags', id);

        if (!noDb || true ) {
            await fetch(`${api_url}/api/db/delete/a/tag?uuid=${tag!.uuid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
        }  

        await db.delete('tags', id);
    }

    public async create(arg: { note: Note, cloud_post?: boolean, idInTheProps?: boolean }): Promise<{ id: number }> {

        const db = await this.dbPromise;

        if (!arg.idInTheProps) {
            arg.note.id = Math.floor(Math.random() * (999999999999 - 1000000 + 1)) + 1000;
            arg.note.uuid = await utils.UUID();
        }

        arg.note.tags = [];

        await db.add('notes', arg.note);

        if (arg.cloud_post) {
            await fetch(`${api_url}/api/db/new/note`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ note: arg.note }),
            })
        }

        return { id: arg.note.id };

    }

    public async create_tag(tag: Tag, cloud_post: boolean): Promise<void> {
        const db = await this.dbPromise;
        if (cloud_post) {
            tag.uuid = await utils.UUID();
            tag.id = Math.floor(Math.random() * (999999999999 - 1000000 + 1)) + 1000

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
        return await db.get('notes', id);
    }
    
    public async getTag(id: number): Promise<Tag | undefined> {
        const db = await this.dbPromise;
        return await db.get('tags', id);
    }

    public async add_notes(notes: Note[], cloud_post: boolean): Promise<void> {

        if (notes.length) {

            for (const note of notes) {
                if (!note.title && !note.content) continue;
                await this.create({
                    note,
                    cloud_post,
                    idInTheProps: true
                });
            }

        }

    }

    public async add_tags(tags: Tag[], cloud_post: boolean): Promise<void> {

        if (tags.length) {

            for (const tag of tags) {
                await this.create_tag(tag, cloud_post);
            }

        }

    }

    public async save_tag_color(id: number, color: string) {

        if (!color) return;

        const db = await this.dbPromise;
        const tag = await db.get('tags', id);

        if (tag) {

            tag._id = undefined;
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

    public async reset({ localANDcloud }: { localANDcloud?: boolean } = {}): Promise<void> {

        const notes = await this.getAll('notes');
        const tags = await this.getAll('tags');

        for (const tag of tags) {
            await this.delete_tag(tag.id, localANDcloud == true ? false : true);
        }

        for (const note of notes) {
            await this.delete(note.id, localANDcloud == true ? false : true);
        }

    }

}

export default new Database(
    // notes,
    // tags,
    undefined,
    undefined
);
