
import db from './database';
import { salert } from './salert';
import type { Note, Tag } from './type';
import utils from './utils';
import { dev } from '@/../package.json';

export const api_url: string = dev ? 'http://localhost:3000' : 'https://api.silvernote.fr'; // 'https://api.silvernote.fr' || 'http://localhost:3000'


const dev_db: { notes: Note[], tags: Tag[] } = {
  tags: [
    { id: 1, active: false, name: "Work", color: "#FFB6C1" },
    { id: 2, active: false, name: "Personal", color: "#ADD8E6" },
    { id: 3, active: false, name: "Ideas", color: "#90EE90" },
    { id: 4, active: false, name: "Urgent", color: "#FFA500" },
    { id: 5, active: false, name: "Shopping", color: "#FFD700" },
    { id: 6, active: false, name: "Travel", color: "#87CEFA" },
    { id: 7, active: false, name: "Fitness", color: "#98FB98" },
    { id: 8, active: false, name: "Projects", color: "#DA70D6" },
    { id: 9, active: false, name: "Learning", color: "#F08080" },
    { id: 10, active: false, name: "Misc", color: "#D3D3D3" }
  ],
  notes: Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    const uuid = crypto.randomUUID();
    const pinned = Math.random() < 0.3; // 30% de chance d'être épinglé
    const simply_edit = Math.random() < 0.5;
    const title = `Note ${id}`;
    const content = `<p>Ceci est le contenu <strong>HTML</strong> de la note ${id}. Vous pouvez y mettre <em>du texte</em> riche et des listes :</p>
                     <ul>
                        <li>Point 1</li>
                        <li>Point 2</li>
                     </ul>`;
    const date = utils.date();
    const tags = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
      Math.floor(Math.random() * 10) + 1
    ); // 1 à 3 tags aléatoires

    return {
      id,
      uuid,
      pinned,
      simply_edit,
      title,
      content,
      date,
      tags
    } as Note;
  })
};




const info_message = async (): Promise<{ message: string, title: string, btn: boolean, href: string } | undefined> => {
    const res = await fetch(`${api_url}/api/get_news`).then(res => res.json());
    return res == false ? undefined : res;
};


export class Session {

  async create (user: any): Promise<void> {
    await fetch(`${api_url}/user/create`, {
      method: 'POST',
      body: JSON.stringify({ user: user }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    await fetch(`${api_url}/user/session/create`, {
      method: 'POST',
      body: JSON.stringify({ platform: 'web', userId: user.id }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    }); 
  }

  async close (): Promise<any> {
    return await fetch(`${api_url}/user/session/close`, {
      'method': 'POST'
    }).then(res => res.json());
  }

  async verify (): Promise<boolean> {
    return await fetch(`${api_url}/user/session/verify`, {
      'method': 'POST'
    }).then(res => res.json());
  }

}


const save_all = async (notes: Note[], tags: Tag[]): Promise<any> => {

  const res_notes = await fetch(`${api_url}/api/save/db/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ notes }),
  }).then(res => res.json());

  const res_tags = await fetch(`${api_url}/api/save/db/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ tags }),
  }).then(res => res.json());

  if (res_notes.error) return salert('Une erreur est survenue lors de la sauvegarde des notes', 'error');
  if (res_tags.error) return salert('Une erreur est survenue lors de la sauvegarde des dossiers', 'error');

  if (res_notes && res_tags) return salert('Notes et dossiers sauvegardé avec succès !', 'success');

}

const get_all = async (): Promise<{ notes: Note[], tags: Tag[], hash: any } | undefined> => {
return undefined
  //await fetch(`${auth_url}/verify`).then(res => res.json()) ||
  const user =  { sub: 'auth0|609e8b2e3b3f9c0071f7abcd' };

  const res = await fetch(`${api_url}/get_db`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user }),
  }).then(res => res.json());
  return res;

}

const save_db = async (): Promise<any> => {
return
//await fetch(`${auth_url}/verify`).then(res => res.json()) ||
  const user =  { sub: 'auth0|609e8b2e3b3f9c0071f7abcd' };
  const Notes: Note[] = await db.getAll('notes');
  const Tags: Tag[] = await db.getAll('tags');

  const res = await fetch(`${api_url}/save_db`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Notes, Tags, user }),
  }).then(res => res.json());
  return res;

}
export default {
    dev_db,
    info_message,
    save_all,
    get_all,
    save_db
}