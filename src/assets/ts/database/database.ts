import type { Note, Tag } from '../type';
import { api_url } from '../backend_link';
import type { Socket } from 'socket.io-client';
import { useToken } from '@/composables/useToken';
import { Notes, Tags } from './Var';

class Database {
    
    private async getHeaders() {
        const { token } = await useToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.value}`
        };
    }

    /**
     * Envoi d'une note vers le serveur (via Socket ou Fetch)
     */
    private async push_note(note: Note, socket?: Socket) {
        if (socket) {
            socket.emit('edit_note', { 
                uuid: note.uuid,
                content: note.content,
                title: note.title
            });
        } else {
            await fetch(`${api_url}/api/db/update/a/note`, {
                method: 'POST',
                headers: await this.getHeaders(),
                credentials: 'include',
                body: JSON.stringify({ note }),
            });
        }
    }

    /**
     * Récupération de toutes les données (Notes ou Tags)
     */
    public async getAll<T extends 'notes' | 'tags'>(type: T): Promise<T extends 'notes' ? Note[] : Tag[]> {
        const endpoint = type === 'notes' ? 'get/notes' : 'get/tags';
        const response = await fetch(`${api_url}/api/db/${endpoint}`, {
            headers: await this.getHeaders(),
            credentials: 'include',
        });
        return await response.json();
    }

    /**
     * Création d'une nouvelle note
     */
    public async create(note: Note): Promise<void> {

        await fetch(`${api_url}/api/db/new/note`, {
            method: 'POST',
            headers: await this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ note }),
        });
    }

    /**
     * Mise à jour globale d'une note
     */
    public async update(note: Note) {
        await this.push_note(note);
    }

    /**
     * Mise à jour partielle (ex: icône, titre, contenu)
     */
    public async updateField(note: Note, socket?: Socket) {
        await this.push_note(note, socket);
    }

    /**
     * Suppression d'une note
     */
    public async delete(uuid: string): Promise<void> {
        await fetch(`${api_url}/api/db/delete/a/note?uuid=${uuid}`, {
            method: 'POST',
            headers: await this.getHeaders(),
            credentials: 'include',
        });
    }

    /**
     * Création d'un tag
     */
    public async create_tag(tag: Tag): Promise<void> {
        tag.id = parseInt(Date.now() + Math.floor(Math.random() * 1000).toString());
        await fetch(`${api_url}/api/db/new/tag`, {
            method: 'POST',
            headers: await this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ tag }),
        });
    }

    /**
     * Mise à jour de la couleur d'un tag
     */
    public async save_tag_color(tag: Tag, color: string) {
        if (!color) return;
        tag.color = color;
        
        await fetch(`${api_url}/api/db/update/a/tag`, {
            method: 'POST',
            headers: await this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ tag }),
        });
    }

    /**
     * Suppression d'un tag
     */
    public async delete_tag(id: number): Promise<void> {
        await fetch(`${api_url}/api/db/delete/a/tag?id=${id}`, {
            method: 'POST',
            headers: await this.getHeaders(),
            credentials: 'include',
        });
    }

    /**
     * Reset des données sur le cloud
     */
    public async reset(): Promise<void> {
        for (const tag of Tags.value) await this.delete_tag(tag.id);
        for (const note of Notes.value) await this.delete(note.uuid);
    }
    
}

export default new Database();