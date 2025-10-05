
import db from '@/assets/ts/database/database';

import { nextTick, type Ref } from "vue";
import type { Note } from "../type";
import { Notes, Tags, SharedNotes } from "./Var";
import { api_url } from '../backend_link';


class InitDB {


    private user: Ref<any> | undefined;
    private loaded: boolean;

    constructor () {

        this.user = undefined;
        this.loaded = false;

    }

    public init (user: Ref<any>): void {
        this.user = user;
    }

    public async main (): Promise<void> 
    {

        try {

            if (!await this.verify_cloud_db()) 
            {
                
                db.reset().then(async () => {

                    await this.init_cloud_tags();
                    await this.init_cloud_notes();

                });

            }

            await this.init_shared_notes();
            await this.init_local_notes();
            await this.init_local_tags();

            await nextTick();
            this.loaded = true;

        }
        catch (err) {
            console.error('Une erreur est survenue lors de l\'init de la db :', err);
        }

    }


    
    public async init_local_notes (): Promise<void> 
    {
    
        Notes.value = [];
        Notes.value = await db.getAll('notes');

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

    public async init_local_tags (): Promise<void> 
    {
        Tags.value = [];
        Tags.value = await db.getAll('tags');
    }


    private async init_cloud_notes (): Promise<void> 
    {
        const data = await fetch(`${api_url}/api/db/get/user/notes?user_id=${this.user?.value?.id}`)
                        .then(res => res.json());
        if (data) {
            await db.add_notes(data.notes, false);
        }
    }

    private async init_cloud_tags (): Promise<void> 
    {
        const data = await fetch(`${api_url}/api/db/get/user/tags?user_id=${this.user?.value?.id}`)
                        .then(res => res.json());
        if (data) {
            await db.add_tags(data.tags, false);
        }
    }

    public async init_shared_notes (): Promise<void> 
    {
        const res = await fetch(`${api_url}/api/share/for/me`, {
            credentials: 'include',
        }).then(res => res.json());

        if (res.error) {
            console.error('Error on get shared notes fetch : ', res.message);
            return;
        }

        if (res.length < 1) {
            SharedNotes.value = [];
            return;
        }

        SharedNotes.value = res.notes;
        return;
    }

    
    private async verify_cloud_db (): Promise<boolean> 
    {
        const res = await fetch(`${api_url}/api/db/verify/data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ 
                notes: await db.getAll('notes') || [], 
                tags: await db.getAll('tags') || []
            }),
        }).then(res => res.json());
        return res.ok;
    }

    public isLoaded (): boolean {
        return this.loaded;
    }
 
}


export default new InitDB();