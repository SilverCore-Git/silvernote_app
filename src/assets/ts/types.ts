
export interface User {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  nickname: string;
  picture: string;
  email: string;
  email_verified: boolean;
  updated_at: string;
  locale: string;
}

export interface Note {
    id: number;
    pinned: boolean;
    simply_edit: boolean;
    title: string;
    content: string;
    date: string;
    tags: Number[];
};

export interface Tag {
    id: number;
    active: boolean;
    name: string;
    color: string;
};

export interface Layout_data {
    files: string[];
    notes_lenght: number;
    tags_lenght: number;
}

// export type Hash_data = {
//     tags: Promise<string>;
//     notes: Promise<string>;
//     user: Promise<string>;
//     layout: Promise<string>;
// }