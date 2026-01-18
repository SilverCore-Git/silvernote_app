import { type Ref } from "vue";
import { Notes, Tags, SharedNotes } from "./Var";
import { api_url } from '../backend_link';
import { useToken } from '@/composables/useToken';


class InitDB {

    private user: Ref<any> | undefined;
    private loaded: boolean;
    private token: string;

    constructor () {

        this.loaded = false;
        this.token = '';

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

            const { waitUntilReady, token } = useToken();

            await waitUntilReady();

            if (!token.value) return console.error('Token is null => init db');
            this.token = token.value;

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

    public async init_cloud_notes (): Promise<void> 
    {
        const data = await fetch(`${api_url}/api/db/get/user/notes?user_id=${this.user?.value?.id}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        }).then(res => res.json());
        if (data) {
            Notes.value = data.notes;
        }
    }


    public async init_cloud_tags (): Promise<void> 
    {
        const data = await fetch(`${api_url}/api/db/get/user/tags?user_id=${this.user?.value?.id}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        }).then(res => res.json());
        if (data) {
            Tags.value = data.tags;
        }
    }

    public async init_shared_notes (): Promise<void> 
    {
        const res = await fetch(`${api_url}/api/share/for/me`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
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

    public isLoaded (): boolean {
        return this.loaded;
    }
 
}


export default new InitDB();