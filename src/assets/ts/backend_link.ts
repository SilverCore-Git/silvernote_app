
import type { Note, Tag } from './type';


const db = {
  notes: [
    {id: 1, pinned: false, simply_edit: false, title: "Buy groceries", content: "<p>Buy milk, eggs, and bread.</p>", date: "20 juin 2025", tags: [9, 6]},
    {id: 2, pinned: false, simply_edit: false, title: "Meeting with the team", content: "<p>Discuss the new project timeline.</p>", date: "21 juin 2025", tags: [8, 5]},
    {id: 3, pinned: false, simply_edit: false, title: "Urgent: Fix bug in the app", content: "<p>Critical bug needs to be fixed before release.</p>", date: "22 juin 2025", tags: [1, 3]},
    {id: 4, pinned: false, simply_edit: false, title: "Write a new blog post", content: "<p>Write about the importance of time management.</p>", date: "23 juin 2025", tags: [7, 5]},
    {id: 5, pinned: false, simply_edit: false, title: "Doctor appointment", content: "<p>Check-up appointment at 2:30 PM.</p>", date: "24 juin 2025", tags: [10, 4]},
    {id: 6, pinned: false, simply_edit: false, title: "Plan weekend trip", content: "<p>Plan a trip to the beach with friends.</p>", date: "25 juin 2025", tags: [4, 7]},
    {id: 7, pinned: false, simply_edit: false, title: "Call Mom", content: "<p>Check in with mom and see how she's doing.</p>", date: "26 juin 2025", tags: [4, 6]},
    {id: 8, pinned: false, simply_edit: false, title: "Send email to client", content: "<p>Follow up on the proposal sent last week.</p>", date: "27 juin 2025", tags: [5, 8]},
    {id: 9, pinned: false, simply_edit: false, title: "Finish project report", content: "<p>Complete the final draft of the report for the project.</p>", date: "28 juin 2025", tags: [3, 5]},
    {id: 10, pinned: false, simply_edit: false, title: "Check car maintenance", content: "<p>Ensure that the car's oil and tires are checked.</p>", date: "29 juin 2025", tags: [9, 10]}
  ],
  tags: [
    {id: 1, name: "Urgent", active: false, color: "#FF5733"},
    {id: 2, name: "To Do", active: false, color: "#33FF57"},
    {id: 3, name: "Important", active: false, color: "#3357FF"},
    {id: 4, name: "Personal", active: false, color: "#F0E68C"},
    {id: 5, name: "Work", active: false, color: "#8A2BE2"},
    {id: 6, name: "Reminder", active: false, color: "#FFD700"},
    {id: 7, name: "Ideas", active: false, color: "#C71585"},
    {id: 8, name: "Meeting", active: false, color: "#20B2AA"},
    {id: 9, name: "Shopping", active: false, color: "#D2691E"},
    {id: 10, name: "Health", active: false, color: "#008080"}
  ]
}


const info_message = (): { message: string, title: string, btn: boolean, href: string } | void => {
    // return { 
    //           message: "SilverNote est actuellement en version bêta. Certaines fonctionnalités peuvent présenter des bugs.", 
    //           title: "SilverNote bêta",
    //           btn: false,
    //           href: "https://www.silvercore.fr"
    //         };
};

const saving_all = async (Notes: Note[], Tags: Tag[]): Promise<void> => {

  const res = await fetch('https://api.silvernote.fr/api/...', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Notes, Tags }),
  });

  // if (res.error) {
  //   // action si erreur
  // }

  if (res.ok) {
    // action apres sauvegarde
  }

}


export default {
    db,
    info_message,
    saving_all
}