interface SimpleAction {
    id: number;
    name: string;
    action: Function;
}

interface SelectedAction {
    selected: true;
    id: number;
    actions: Action[];
}

export type Action = SimpleAction | SelectedAction;

export interface Categories {
    ai: Action[];
    collaboration: Action[];
    text: Action[];
    plus: Action[];
}
