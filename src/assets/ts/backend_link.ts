
import db from './database';
import { salert } from './salert';
import type { Note, Tag } from './type';

const api_url: string = 'http://localhost:3000';
//const auth_url: string = 'https://auth.silvernote.fr';

const generateRandomId = () => {
  return Math.floor(Math.random() * (999999999999 - 1000000 + 1)) + 1000;
}

const dev_db = {
  notes: [
    {
      id: generateRandomId(),
      pinned: false,
      simply_edit: false,
      title: "Buy groceries",
      content: "<p>Buy milk, eggs, and bread.</p><p>Also check if we need butter, fruits (especially bananas and apples), and some vegetables like carrots or spinach. Don't forget to bring reusable bags and check for any store discounts or loyalty points. Consider meal planning for the week to avoid food waste.</p>",
      date: "20 juin 2025",
      tags: [9, 6]
    },
    {
      id: generateRandomId(),
      pinned: false,
      simply_edit: false,
      title: "Meeting with the team",
      content: "<p>Discuss the new project timeline.</p><p>Prepare slides outlining the current progress, deadlines, and upcoming milestones. Assign responsibilities clearly to team members and allocate buffer time for potential delays. Bring up any blockers or dependencies that need resolution. Consider a brainstorming session to refine the scope of features.</p>",
      date: "21 juin 2025",
      tags: [8, 5]
    },
    {
      id: generateRandomId(),
      pinned: false,
      simply_edit: false,
      title: "Urgent: Fix bug in the app",
      content: "<p>Critical bug needs to be fixed before release.</p><p>The bug appears when users try to upload files larger than 5MB — causing the app to crash. Reproduce the issue locally, check the stack trace, and look into the recent commits that might have introduced the error. Once fixed, write a unit test to prevent regressions and notify QA for immediate testing.</p>",
      date: "22 juin 2025",
      tags: [1, 3]
    },
    {
      id: generateRandomId(),
      pinned: false,
      simply_edit: false,
      title: "Write a new blog post",
      content: "<p>Write about the importance of time management.</p><p>Include personal anecdotes about productivity strategies that worked, such as using Pomodoro, daily planning, and prioritizing tasks with Eisenhower Matrix. Add references to books like 'Deep Work' by Cal Newport. Include actionable tips for readers and end with a call to reflect on how they spend their time daily.</p>",
      date: "23 juin 2025",
      tags: [7, 5]
    },
    {
      id: generateRandomId(),
      pinned: false,
      simply_edit: false,
      title: "Doctor appointment",
      content: "<p>Check-up appointment at 2:30 PM.</p><p>Location: Dr. Lambert’s Clinic, 2nd floor, Room 204. Bring medical records and list of any symptoms or concerns to discuss. Check if vaccinations are up to date and ask about blood work results from last visit. Consider asking about diet and general wellness advice.</p>",
      date: "24 juin 2025",
      tags: [10, 4]
    },
    {
      id: generateRandomId(),
      pinned: false,
      simply_edit: false,
      title: "Plan weekend trip",
      content: "<p>Plan a trip to the beach with friends.</p><p>Destination idea: Arcachon or Biarritz. Book Airbnb early, check the weather forecast, and make a list of supplies (sunscreen, towels, snacks, water). Discuss carpooling or train options. Plan activities like beach volleyball, sunset watching, or a small barbecue. Don’t forget to bring speakers and portable charger.</p>",
      date: "25 juin 2025",
      tags: [4, 7]
    },
    {
      id: generateRandomId(),
      pinned: false,
      simply_edit: false,
      title: "Call Mom",
      content: "<p>Check in with mom and see how she's doing.</p><p>Ask about her recent medical check-up and whether she needs help with groceries or errands. Share updates about work and weekend plans. Remind her about the family dinner next Sunday. Maybe suggest doing a video call to see her garden progress. Bring up her birthday gift ideas if not done yet.</p>",
      date: "26 juin 2025",
      tags: [4, 6]
    },
    {
      id: generateRandomId(),
      pinned: false,
      simply_edit: false,
      title: "Send email to client",
      content: "<p>Follow up on the proposal sent last week.</p><p>Include a summary of the offer, reiterate key benefits, and provide an estimated timeline. Ask if they have any feedback or concerns. Offer to set up a call to discuss further details. Attach the final version of the document and thank them for considering the proposal. Mention availability for next week.</p>",
      date: "27 juin 2025",
      tags: [5, 8]
    },
    {
      id: generateRandomId(),
      pinned: false,
      simply_edit: false,
      title: "Finish project report",
      content: "<p>Complete the final draft of the report for the project.</p><p>Double-check data accuracy and formatting consistency. Ensure that all sections—executive summary, methodology, results, and conclusions—are clearly written. Include relevant charts or graphs. Get feedback from team members and make final edits. Submit to manager by Friday 3 PM. Archive source files in shared drive.</p>",
      date: "28 juin 2025",
      tags: [3, 5]
    },
    {
      id: generateRandomId(),
      pinned: false,
      simply_edit: false,
      title: "Check car maintenance",
      content: "<p>Ensure that the car's oil and tires are checked.</p><p>Schedule an appointment with the garage if needed. Check tire pressure, tread wear, windshield wipers, brake pads, and coolant level. Look into whether the timing belt or battery is due for replacement. Keep the service log updated. Clean the interior and check emergency kit in the trunk.</p>",
      date: "29 juin 2025",
      tags: [9, 10]
    }
  ],
  tags: [
    {id: generateRandomId(), name: "Urgent", active: false, color: "#FF5733"},
    {id: generateRandomId(), name: "To Do", active: false, color: "#33FF57"},
    {id: generateRandomId(), name: "Important", active: false, color: "#3357FF"},
    {id: generateRandomId(), name: "Personal", active: false, color: "#F0E68C"},
    {id: generateRandomId(), name: "Work", active: false, color: "#8A2BE2"},
    {id: generateRandomId(), name: "Reminder", active: false, color: "#FFD700"},
    {id: generateRandomId(), name: "Ideas", active: false, color: "#C71585"},
    {id: generateRandomId(), name: "Meeting", active: false, color: "#20B2AA"},
    {id: generateRandomId(), name: "Shopping", active: false, color: "#D2691E"},
    {id: generateRandomId(), name: "Health", active: false, color: "#008080"}
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

const get_all = async (): Promise<{ notes: Note[], tags: Tag[], hash: any }> => {

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