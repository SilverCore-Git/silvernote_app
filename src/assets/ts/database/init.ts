
import db from '@/assets/ts/database/database';

import { type Ref } from "vue";
import type { Note, Tag } from "../type";
import { Notes, Tags, SharedNotes } from "./Var";
import { api_url } from '../backend_link';
import utils from '../utils';


class InitDB {

    private user: Ref<any> | undefined;
    private clerkToken: string | undefined;
    private loaded: boolean;
    private notes: Note[] | undefined;
    private tags: Tag[] | undefined;

    constructor () {

        this.loaded = false;

    }

    public async init (user: Ref<any>): Promise<void> {
        this.user = user;
        this.clerkToken = `Bearer ${await window.Clerk?.session?.getToken() ?? ''}`;
        await db.init();
    }

    public async main (): Promise<void> 
    {

        if (!this.user || !this.clerkToken) {
            throw new Error('InitDB.init() must be called before main()');
        }

        try {

            [this.notes, this.tags] = await Promise.all([
                db.getAll('notes'),
                db.getAll('tags')
            ])

            if (!await this.verify_cloud_db()) 
            {
                
                await db.reset();

                await Promise.all([
                    this.init_cloud_tags(),
                    this.init_cloud_notes()
                ]);

                [this.notes, this.tags] = await Promise.all([
                    db.getAll('notes'),
                    db.getAll('tags')
                ])

            }

            await Promise.all([
                this.init_shared_notes(),
                this.init_local_notes(),
                this.init_local_tags()
            ]);

            this.loaded = true;

        }
        catch (err) {
            console.error('Une erreur est survenue lors de l\'init de la db :', err);
        }

    }


    
    public async init_local_notes ()
    {

            if (!this.notes) return;
            Notes.value = this.notes;

            const monthMap: Record<string, number> = {
                janvier: 0,
                février: 1,
                mars: 2,
                avril: 3,
                mai: 4,
                juin: 5,
                juillet: 6,
                août: 7,
                septembre: 8,
                octobre: 9,
                novembre: 10,
                décembre: 11,
            };

            function parseFrenchDate(dateStr: string): Date {
                const [day, monthName, year] = dateStr.split(' ');
                const month = monthMap[monthName.toLowerCase()];
                return new Date(Number(year), month, Number(day));
            }

            Notes.value.sort((a: Note, b: Note) => {
                if (a.pinned === b.pinned) {
                    const dateA = parseFrenchDate(a.date);
                    const dateB = parseFrenchDate(b.date);
                    return dateB.getTime() - dateA.getTime();
                }
                return a.pinned ? -1 : 1;
            });

    }

    public async init_local_tags() 
    {
        if (!this.tags) return;
        Tags.value = this.tags;
    }


    public async init_cloud_notes (): Promise<void> 
    {
        const data = await fetch(`${api_url}/api/db/get/user/notes?user_id=${this.user?.value?.id}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.clerkToken || ''
            }
        }).then(res => res.json());
        if (data) {
            await db.add_notes(data.notes, false);
        }
    }


    public async init_cloud_tags (): Promise<void> 
    {
        const data = await fetch(`${api_url}/api/db/get/user/tags?user_id=${this.user?.value?.id}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.clerkToken || ''
            }
        }).then(res => res.json());
        if (data) {
            await db.add_tags(data.tags, false);
        }
    }

    public async init_shared_notes (): Promise<void> 
    {
        const res = await fetch(`${api_url}/api/share/for/me`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.clerkToken || ''
            }
        }).then(res => res.json());

        if (res.error) {
            console.error('Error on get shared notes fetch : ', res.message);
            return;
        }

        if (res.length < 1) { // .lenght est dans la rep json
            SharedNotes.value = [];
            return;
        }

        const resNotes: any[] = res.notes;
        SharedNotes.value = resNotes.filter(note => note.user_id != this.user?.value.id);
        return;
    }

    
    private async verify_cloud_db (): Promise<boolean> 
    {

        if (!this.notes || !this.tags) return false;
        const notes_hash: string = await utils.hash(this.notes);
        const tags_hash: string = await utils.hash(this.tags);

        const res = await fetch(`${api_url}/api/db/verify/data`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.clerkToken || ''
            },
            body: JSON.stringify({ 
                notes: notes_hash, 
                tags: tags_hash
            }),
        }).then(res => res.json());
        return res.ok;
    }

    public isLoaded (): boolean {
        return this.loaded;
    }
 
}


export default new InitDB();