export interface User { 
    type: 'owner' | 'visitor';
    user_id: string;
    imageUrl: string;
    username: string;
    isMe: boolean;
}

export interface Note {
    id: number;
    uuid: string;
    icon?: string;
    pinned: boolean;
    simply_edit: boolean;
    title: string;
    content: string;
    date: string;
    tags: Number[];
    selected?: boolean;
};

export interface Tag {
    uuid: string;
    _id: string | undefined; // added by indexed db
    id: number;
    active: boolean;
    name: string;
    color: string;
};

export interface SettingOption {
  id: string;
  name: string;
  type: string;
  active: boolean;
}

export interface Settings {
  généraux: SettingOption[];
  avancé: SettingOption[];
  dev_mode: SettingOption[];
}