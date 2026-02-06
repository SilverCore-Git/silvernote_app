import { type Ref } from "vue";
import { Notes, Tags, SharedNotes } from "./Var";
import { api_url } from '../backend_link';
import useToken from "@/composables/useToken";


class InitDB {

    private user: Ref<any> | undefined;
    private loaded: boolean;
    private pubLoaded: boolean = false;

    constructor () {

        this.loaded = false;

    }

    public async init (user: Ref<any>): Promise<void> {
        this.user = user;
    }

    public async main (): Promise<void> 
    {

        if (!this.user) {
            throw new Error('InitDB.init() must be called before main()');
        }

        try {

            await Promise.all([
                this.init_cloud_tags(),
                this.init_cloud_notes(),
                this.init_shared_notes()
            ])

            this.loaded = true;

        }
        catch (err) {
            console.error('Une erreur est survenue lors de l\'init de la db :', err);
            throw new Error('Une erreur est survenue lors de l\'init de la db : ' + err);
        }

    }

    public async init_cloud_notes(): Promise<void>
    {

        // Prioritary load : pinned notes and 40 first notes
        const [pinnedRes, firstNotesRes] = await Promise.all([
            fetch(`${api_url}/api/db/notes/pinned`, {
                credentials: 'include',
                headers: { 'Authorization': `Bearer ${await useToken()}` }
            }).then(res => res.json()),
            fetch(`${api_url}/api/db/notes/start/0/end/40?noPinned=1`, {
                credentials: 'include',
                headers: { 'Authorization': `Bearer ${await useToken()}` }
            }).then(res => res.json())
        ]);

        // init for UI
        Notes.value = [...pinnedRes.notes, ...firstNotesRes.notes].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        this.pubLoaded = true;

        this.fetchRemainingNotes(firstNotesRes.total, 40);

    }

    private async fetchRemainingNotes(total: number, startIndex: number): Promise<void>
    {

        let actualIndex = startIndex;
        const step = 40;

        while (Notes.value.length < total)
        {

            try {

                const res = await fetch(`${api_url}/api/db/notes/start/${actualIndex}/end/${actualIndex + step}?noPinned=1`, {
                    credentials: 'include',
                    headers: { 'Authorization': `Bearer ${await useToken()}` }
                }).then(res => res.json());

                if (!res.notes || res.notes.length === 0) break;

                Notes.value = [...Notes.value, ...res.notes].sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                actualIndex += step;

            } catch (err) {
                console.error("Background sync failed : ", err);
                break; 
            }

        }

    }


    public async init_cloud_tags (): Promise<void> 
    {
        const data = await fetch(`${api_url}/api/db/get/user/tags?user_id=${this.user?.value?.id}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await useToken()}`
            }
        }).then(res => res.json());
        if (data) {
            Tags.value = data.tags || [];
        }
    }

    public async init_shared_notes (): Promise<void> 
    {
        const res = await fetch(`${api_url}/api/share/for/me`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await useToken()}`
            }
        }).then(res => res.json());

        if (res.error) {
            console.error('Error on get shared notes fetch : ', res.message);
            return;
        }

        if (res.length < 1) {
            SharedNotes.value = [];
            return;
        }

        const resNotes: any[] = res.notes || [];
        SharedNotes.value = resNotes.filter(note => note.user_id != this.user?.value.id);
        return;
    }

    public isLoaded (): boolean {
        return this.loaded;
    }

    public isPubLoaded (): boolean {
        return this.pubLoaded;
    }
 
}


export default new InitDB();