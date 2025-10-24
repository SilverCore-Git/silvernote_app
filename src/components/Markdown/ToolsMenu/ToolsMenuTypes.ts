export interface SimpleAction {
    id: number;
    name: string;
    action: string; // Function
    tooltip: string;
}

interface SelectedAction {
    selected: true;
    id: number;
    actions: SimpleAction[];
}

export type Action = SimpleAction | SelectedAction;

export interface Categories {
    ai: Action[];
    collaboration: Action[];
    text: Action[];
    plus: Action[];
    MdInputMenu: Action[];
}
