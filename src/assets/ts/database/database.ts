import type { Note, Tag } from '../type';
import { api_url } from '../backend_link';
import useToken from '@/composables/useToken';
import { APICache } from '../cache/apiCache';

class Database {

    private async getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await useToken()}`
        };
    }

    /**
     * Envoi d'une note vers le serveur (via Fetch)
     */
    private async push_note(note: Note) {

        window.dispatchEvent(new CustomEvent('note-saving'));

        try {

            const response = await fetch(`${api_url}/api/db/update/a/note`, {
                method: 'POST',
                headers: await this.getHeaders(),
                credentials: 'include',
                body: JSON.stringify({ note }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update note (HTTP ${response.status})`);
            }

            window.dispatchEvent(new CustomEvent('note-saved'));

        } catch (e) {
            window.dispatchEvent(new CustomEvent('note-save-error'));
            throw e;
        }

    }

    /**
     * Récupération de toutes les données (Notes ou Tags)
     * Utilise le cache pour réduire les requêtes API inutiles
     */
    public async getAll<T extends 'notes' | 'tags'>(type: T, forceRefresh: boolean = false): Promise<T extends 'notes' ? Note[] : Tag[]> {
        const endpoint = type === 'notes' ? 'get/notes' : 'get/tags';
        const url = `${api_url}/api/db/${endpoint}`;
        const category = type; // Utiliser le type comme catégorie pour le TTL

        // Vérifier le cache (sauf si forceRefresh est true)
        if (!forceRefresh) {
            const cachedData = await APICache.get(url, category);
            if (cachedData) {
                return cachedData;
            }
        }

        // Si pas dans le cache ou forceRefresh, faire la requête API
        const response = await fetch(url, {
            headers: await this.getHeaders(),
            credentials: 'include',
        });
        const data = await response.json();

        // Mettre en cache les données
        await APICache.set(url, data, category);

        return data;
    }

    /**
     * Création d'une nouvelle note
     */
    public async create(note: Note): Promise<Note> {

        note.date = new Date().toISOString();

        window.dispatchEvent(new CustomEvent('note-saving'));

        try {

            const response = await fetch(`${api_url}/api/db/new/note`, {
                method: 'POST',
                headers: await this.getHeaders(),
                credentials: 'include',
                body: JSON.stringify({ note }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create note (HTTP ${response.status})`);
            }

            const _note = await response.json().then(res => res.note);

            window.dispatchEvent(new CustomEvent('note-saved'));

            return _note;

        } catch (e) {
            window.dispatchEvent(new CustomEvent('note-save-error'));
            throw e;
        }

    }

    /**
     * Mise à jour globale d'une note
     */
    public async update(note: Note) {
        note._id = undefined;
        await this.push_note(note);
    }

    /**
     * Mise à jour partielle (ex: icône, titre, contenu)
     */
    public async updateField(note: Note) {
        await this.push_note(note);
    }

    /**
     * Suppression d'une note
     */
    public async delete(uuid: string): Promise<void> {

        window.dispatchEvent(new CustomEvent('note-saving'));

        try {

            const response = await fetch(`${api_url}/api/db/delete/a/note?uuid=${uuid}`, {
                method: 'POST',
                headers: await this.getHeaders(),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete note (HTTP ${response.status})`);
            }

            window.dispatchEvent(new CustomEvent('note-saved'));

        } catch (e) {
            window.dispatchEvent(new CustomEvent('note-save-error'));
            throw e;
        }

    }

    /**
     * Création d'un tag
     */
    public async create_tag(tag: Tag): Promise<Tag> {

        tag.id = parseInt(Date.now() + Math.floor(Math.random() * 1000).toString());

        window.dispatchEvent(new CustomEvent('note-saving'));

        try {

            const response = await fetch(`${api_url}/api/db/new/tag`, {
                method: 'POST',
                headers: await this.getHeaders(),
                credentials: 'include',
                body: JSON.stringify({ tag }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create tag (HTTP ${response.status})`);
            }

            const _tag = await response.json().then(res => res.tag);

            window.dispatchEvent(new CustomEvent('note-saved'));

            return _tag;

        } catch (e) {
            window.dispatchEvent(new CustomEvent('note-save-error'));
            throw e;
        }

    }

    /**
     * Mise à jour d'un tag
     */
    public async updateTag(tag: Tag) {

        tag._id = undefined;

        window.dispatchEvent(new CustomEvent('note-saving'));

        try {

            const response = await fetch(`${api_url}/api/db/update/a/tag`, {
                method: 'POST',
                headers: await this.getHeaders(),
                credentials: 'include',
                body: JSON.stringify({ tag }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update tag (HTTP ${response.status})`);
            }

            window.dispatchEvent(new CustomEvent('note-saved'));

        } catch (e) {
            window.dispatchEvent(new CustomEvent('note-save-error'));
            throw e;
        }

    }

    /**
     * Suppression d'un tag
     */
    public async delete_tag(uuid: string): Promise<void> {

        window.dispatchEvent(new CustomEvent('note-saving'));

        try {

            const response = await fetch(`${api_url}/api/db/delete/a/tag?uuid=${uuid}`, {
                method: 'POST',
                headers: await this.getHeaders(),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete tag (HTTP ${response.status})`);
            }

            window.dispatchEvent(new CustomEvent('note-saved'));

        } catch (e) {
            window.dispatchEvent(new CustomEvent('note-save-error'));
            throw e;
        }

    }

    /**
     * Reset des données sur le cloud
     */
    public async reset(): Promise<void>
    {

        await fetch(`${api_url}/api/db/delete/tags`, {
            method: 'POST',
            headers: await this.getHeaders(),
            credentials: 'include',
        });

        await fetch(`${api_url}/api/db/delete/notes`, {
            method: 'POST',
            headers: await this.getHeaders(),
            credentials: 'include',
        });

    }

}

export default new Database();
