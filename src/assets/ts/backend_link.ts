
import db from './database';
import { salert } from './salert';
import type { Note, Tag } from './type';

const api_url: string = 'https://api.silvernote.fr';


const dev_db = {
  notes: [
    {
      id: 20000001,
      pinned: false,
      simply_edit: false,
      title: "Buy groceries",
      content: "<p>Buy milk, eggs, and bread.</p>",
      date: "20 juin 2025",
      tags: [10000009, 10000004]
    },
    {
      id: 20000002,
      pinned: true,
      simply_edit: false,
      title: "Meeting with the team",
      content: "<p>Discuss the new project timeline.</p>",
      date: "21 juin 2025",
      tags: [10000005, 10000008]
    },
    {
      id: 20000003,
      pinned: false,
      simply_edit: false,
      title: "Fix bug in the app",
      content: "<p>Critical bug needs to be fixed before release.</p>",
      date: "22 juin 2025",
      tags: [10000001, 10000003]
    },
    {
      id: 20000004,
      pinned: false,
      simply_edit: false,
      title: "Write blog post",
      content: "<p>Write about time management strategies.</p>",
      date: "23 juin 2025",
      tags: [10000007, 10000003]
    },
    {
      id: 20000005,
      pinned: false,
      simply_edit: false,
      title: "Doctor appointment",
      content: "<p>Check-up appointment at 2:30 PM.</p>",
      date: "24 juin 2025",
      tags: [10000010, 10000006]
    },
    {
      id: 20000006,
      pinned: false,
      simply_edit: false,
      title: "Plan weekend trip",
      content: "<p>Plan a trip to the beach with friends.</p>",
      date: "25 juin 2025",
      tags: [10000004, 10000007]
    },
    {
      id: 20000007,
      pinned: false,
      simply_edit: false,
      title: "Call Mom",
      content: "<p>Check in with mom and see how she's doing.</p>",
      date: "26 juin 2025",
      tags: [10000004]
    },
    {
      id: 20000008,
      pinned: false,
      simply_edit: false,
      title: "Send email to client",
      content: "<p>Follow up on the proposal sent last week.</p>",
      date: "27 juin 2025",
      tags: [10000005, 10000002]
    },
    {
      id: 20000009,
      pinned: false,
      simply_edit: false,
      title: "Finish project report",
      content: "<p>Complete the final draft of the report for the project.</p>",
      date: "28 juin 2025",
      tags: [10000005, 10000003]
    },
    {
      id: 20000010,
      pinned: false,
      simply_edit: false,
      title: "Check car maintenance",
      content: "<p>Ensure that the car's oil and tires are checked.</p>",
      date: "29 juin 2025",
      tags: [10000006]
    }
  ],
  tags: [
    { id: 10000001, name: "Urgent", active: false, color: "#FF5733" },
    { id: 10000002, name: "To Do", active: false, color: "#33FF57" },
    { id: 10000003, name: "Important", active: false, color: "#3357FF" },
    { id: 10000004, name: "Personal", active: false, color: "#F0E68C" },
    { id: 10000005, name: "Work", active: false, color: "#8A2BE2" },
    { id: 10000006, name: "Reminder", active: false, color: "#FFD700" },
    { id: 10000007, name: "Ideas", active: false, color: "#C71585" },
    { id: 10000008, name: "Meeting", active: false, color: "#20B2AA" },
    { id: 10000009, name: "Shopping", active: false, color: "#D2691E" },
    { id: 10000010, name: "Health", active: false, color: "#008080" }
  ]
}



const info_message = async (): Promise<{ message: string, title: string, btn: boolean, href: string } | undefined> => {
    const res = await fetch(`${api_url}/api/get_news`).then(res => res.json());
    return res == false ? undefined : res;
};


export class Session {

  async create (id: string): Promise<void> {
    await fetch(`${api_url}/user/session/create`, {
      method: 'POST',
      body: JSON.stringify({ platform: 'web', userId: id }),
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