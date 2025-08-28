

export interface Note {
    id: number;
    uuid: string;
    pinned: boolean;
    simply_edit: boolean;
    title: string;
    content: string;
    date: string;
    tags: Number[];
    selected?: boolean;
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