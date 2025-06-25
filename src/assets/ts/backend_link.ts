
import type { Note, Tag } from './type';


const dev_db = {
  notes: [
    {
      id: 1,
      pinned: false,
      simply_edit: false,
      title: "Buy groceries",
      content: "<p>Buy milk, eggs, and bread.</p><p>Also check if we need butter, fruits (especially bananas and apples), and some vegetables like carrots or spinach. Don't forget to bring reusable bags and check for any store discounts or loyalty points. Consider meal planning for the week to avoid food waste.</p>",
      date: "20 juin 2025",
      tags: [9, 6]
    },
    {
      id: 2,
      pinned: false,
      simply_edit: false,
      title: "Meeting with the team",
      content: "<p>Discuss the new project timeline.</p><p>Prepare slides outlining the current progress, deadlines, and upcoming milestones. Assign responsibilities clearly to team members and allocate buffer time for potential delays. Bring up any blockers or dependencies that need resolution. Consider a brainstorming session to refine the scope of features.</p>",
      date: "21 juin 2025",
      tags: [8, 5]
    },
    {
      id: 3,
      pinned: false,
      simply_edit: false,
      title: "Urgent: Fix bug in the app",
      content: "<p>Critical bug needs to be fixed before release.</p><p>The bug appears when users try to upload files larger than 5MB — causing the app to crash. Reproduce the issue locally, check the stack trace, and look into the recent commits that might have introduced the error. Once fixed, write a unit test to prevent regressions and notify QA for immediate testing.</p>",
      date: "22 juin 2025",
      tags: [1, 3]
    },
    {
      id: 4,
      pinned: false,
      simply_edit: false,
      title: "Write a new blog post",
      content: "<p>Write about the importance of time management.</p><p>Include personal anecdotes about productivity strategies that worked, such as using Pomodoro, daily planning, and prioritizing tasks with Eisenhower Matrix. Add references to books like 'Deep Work' by Cal Newport. Include actionable tips for readers and end with a call to reflect on how they spend their time daily.</p>",
      date: "23 juin 2025",
      tags: [7, 5]
    },
    {
      id: 5,
      pinned: false,
      simply_edit: false,
      title: "Doctor appointment",
      content: "<p>Check-up appointment at 2:30 PM.</p><p>Location: Dr. Lambert’s Clinic, 2nd floor, Room 204. Bring medical records and list of any symptoms or concerns to discuss. Check if vaccinations are up to date and ask about blood work results from last visit. Consider asking about diet and general wellness advice.</p>",
      date: "24 juin 2025",
      tags: [10, 4]
    },
    {
      id: 6,
      pinned: false,
      simply_edit: false,
      title: "Plan weekend trip",
      content: "<p>Plan a trip to the beach with friends.</p><p>Destination idea: Arcachon or Biarritz. Book Airbnb early, check the weather forecast, and make a list of supplies (sunscreen, towels, snacks, water). Discuss carpooling or train options. Plan activities like beach volleyball, sunset watching, or a small barbecue. Don’t forget to bring speakers and portable charger.</p>",
      date: "25 juin 2025",
      tags: [4, 7]
    },
    {
      id: 7,
      pinned: false,
      simply_edit: false,
      title: "Call Mom",
      content: "<p>Check in with mom and see how she's doing.</p><p>Ask about her recent medical check-up and whether she needs help with groceries or errands. Share updates about work and weekend plans. Remind her about the family dinner next Sunday. Maybe suggest doing a video call to see her garden progress. Bring up her birthday gift ideas if not done yet.</p>",
      date: "26 juin 2025",
      tags: [4, 6]
    },
    {
      id: 8,
      pinned: false,
      simply_edit: false,
      title: "Send email to client",
      content: "<p>Follow up on the proposal sent last week.</p><p>Include a summary of the offer, reiterate key benefits, and provide an estimated timeline. Ask if they have any feedback or concerns. Offer to set up a call to discuss further details. Attach the final version of the document and thank them for considering the proposal. Mention availability for next week.</p>",
      date: "27 juin 2025",
      tags: [5, 8]
    },
    {
      id: 9,
      pinned: false,
      simply_edit: false,
      title: "Finish project report",
      content: "<p>Complete the final draft of the report for the project.</p><p>Double-check data accuracy and formatting consistency. Ensure that all sections—executive summary, methodology, results, and conclusions—are clearly written. Include relevant charts or graphs. Get feedback from team members and make final edits. Submit to manager by Friday 3 PM. Archive source files in shared drive.</p>",
      date: "28 juin 2025",
      tags: [3, 5]
    },
    {
      id: 10,
      pinned: false,
      simply_edit: false,
      title: "Check car maintenance",
      content: "<p>Ensure that the car's oil and tires are checked.</p><p>Schedule an appointment with the garage if needed. Check tire pressure, tread wear, windshield wipers, brake pads, and coolant level. Look into whether the timing belt or battery is due for replacement. Keep the service log updated. Clean the interior and check emergency kit in the trunk.</p>",
      date: "29 juin 2025",
      tags: [9, 10]
    }
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



const info_message = async (): Promise<{ message: string, title: string, btn: boolean, href: string } | undefined> => {
    const res = await fetch('http://localhost:3000/get_news').then(res => res.json());
    return res == false ? undefined : res;
};

const saving_all = async (Notes: Note[], Tags: Tag[]): Promise<void> => {

  const user = await fetch('https://auth.silvernote.fr/verify').then(res => res.json());
  const res = await fetch('https://api.silvernote.fr/save_db', {
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
    saving_all
}