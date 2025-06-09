
import type { Note, Tag } from './type';


const db = {
  notes: [
    { id: 1, pinned: false, simply_edit: true, title: "Note 1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "01 Janvier 2025", tags: [ 3, 5 ] },
    { id: 2, pinned: false, simply_edit: true, title: "Note 2", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "02 Janvier 2025", tags: [1] },
    { id: 3, pinned: false, simply_edit: true, title: "Note 3", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "03 Janvier 2025", tags: [ 2, 6, 7 ] },
    { id: 4, pinned: false, simply_edit: true, title: "Note 4", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "04 Janvier 2025", tags: [5] },
    { id: 5, pinned: false, simply_edit: true, title: "Note 5", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "05 Janvier 2025", tags: [] },
    { id: 6, pinned: false, simply_edit: true, title: "Note 6", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "06 Janvier 2025", tags: [7] },
    { id: 7, pinned: false, simply_edit: true, title: "Note 7", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "07 Janvier 2025", tags: [2, 5] },
    { id: 8, pinned: false, simply_edit: true, title: "Note 8", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "08 Janvier 2025", tags: [6] },
    { id: 9, pinned: false, simply_edit: true, title: "Note 9", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "09 Janvier 2025", tags: [1, 4, 7] },
    { id: 10, pinned: false, simply_edit: true, title: "Note 10", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "10 Janvier 2025", tags: [3] },
    { id: 11, pinned: false, simply_edit: true, title: "Note 11", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "11 Janvier 2025", tags: [] },
    { id: 12, pinned: false, simply_edit: true, title: "Note 12", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "12 Janvier 2025", tags: [2] },
    { id: 13, pinned: false, simply_edit: true, title: "Note 13", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "13 Janvier 2025", tags: [1, 6] },
    { id: 14, pinned: false, simply_edit: true, title: "Note 14", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "14 Janvier 2025", tags: [4] },
    { id: 15, pinned: false, simply_edit: true, title: "Note 15", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "15 Janvier 2025", tags: [3, 5] },
    { id: 16, pinned: false, simply_edit: true, title: "Note 16", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "16 Janvier 2025", tags: [7] },
    { id: 17, pinned: false, simply_edit: true, title: "Note 17", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "17 Janvier 2025", tags: [3, 4] },
    { id: 18, pinned: false, simply_edit: true, title: "Note 18", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "18 Janvier 2025", tags: [1] },
    { id: 19, pinned: false, simply_edit: true, title: "Note 19", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "19 Janvier 2025", tags: [] },
    { id: 20, pinned: false, simply_edit: true, title: "Note 20", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", date: "20 Janvier 2025", tags: [5] }
  ],
  tags: [
    { id: 1, name: "tag 1", active: false },
    { id: 2, name: "tag 2", active: false },
    { id: 3, name: "tag 3", active: false },
    { id: 4, name: "tag 4", active: false },
    { id: 5, name: "tag 5", active: false },
    { id: 6, name: "tag 6", active: false },
    { id: 7, name: "tag 7", active: false }
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