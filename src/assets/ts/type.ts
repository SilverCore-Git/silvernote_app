

export interface Note {
    id: number;
    pinned: boolean;
    simply_edit: boolean;
    istodo?: boolean;
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