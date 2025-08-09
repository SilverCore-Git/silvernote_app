import { UUID } from "crypto";
import { Plan } from "./plan";

export interface User { 
    userId: string;
    customerId?: string;
    plan: Plan[];
};

export interface News { 
    active: boolean;
    message: string; 
    title: string;
    btn: boolean;
    href: string;
};

export interface Layout {
    all: number;
    file: number;
    db: { 
        file: string;
        value: number;
        full: boolean;
    }[]
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

export interface Session {
    id: UUID;
    start: Date;
    end: Date;
    user: string;
    state: "open" | "close" | "error";
}