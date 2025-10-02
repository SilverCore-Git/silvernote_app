
import db from '@/assets/ts/database/database';
import { useUser } from '@clerk/vue';
import type { UserResource } from "@clerk/types";

import type { Ref } from "vue";
import type { Note, Tag } from "../type";
import { Notes } from "./Notes";
import Tags from "./Tags";
import { api_url } from '../backend_link';


class InitDB {



    private tags: Ref<Tag[]>;
    private notes: Ref<Note[]>;
    private user: Ref<UserResource | null | undefined>;

    constructor () {
        
        this.notes = Notes;
        this.tags = Tags;
        this.user = useUser().user;

    }

    public async main (): Promise<void> 
    {

        try {

            if (await this.verify_cloud_db()) 
            {

                await this.init_local_notes();
                await this.init_local_tags();

            }

            else
            {

                await this.init_cloud_notes();
                await this.init_cloud_tags();

            }

        }
        catch (err) {
            console.error('Une erreur est survenue lors de l\'init de la db :', err);
        }
        finally {
            Notes.value = this.notes.value;
            Tags.value = this.tags.value;
        }

    }


    
    private async init_local_notes (): Promise<void> 
    {
    
        this.notes.value = await db.getAll('notes');

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

        this.notes.value.sort((a: Note, b: Note) => {
            if (a.pinned === b.pinned) {
            const dateA = parseFrenchDate(a.date);
            const dateB = parseFrenchDate(b.date);
            return dateB.getTime() - dateA.getTime();
            }
            return a.pinned ? -1 : 1;
        });
        
    }

    private async init_local_tags (): Promise<void> 
    {
        this.tags.value = await db.getAll('tags');
    }


    private async init_cloud_notes (): Promise<void> 
    {
        const data = await fetch(`${api_url}/api/db/get/user/notes?user_id=${this.user.value?.id}`)
                        .then(res => res.json());
        if (data) {
            for (const note of data.notes) {
                await db.add_notes(note);
            }
        }
    }

    private async init_cloud_tags (): Promise<void> 
    {
        const data = await fetch(`${api_url}/api/db/get/user/tags?user_id=${this.user.value?.id}`)
                        .then(res => res.json());
        if (data) {
            for (const tag of data.tags) {
                await db.add_tags(tag);
            }
        }
    }

    
    private async verify_cloud_db (): Promise<boolean> 
    {
        return await fetch(`${api_url}/api/db/verify/data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ 
            notes: await db.getAll('notes'), 
            tags: await db.getAll('tags') 
            }),
        }).then(res => res.json());
    }



}


export default InitDB;