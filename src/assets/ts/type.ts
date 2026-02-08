export interface User { 
    type: 'owner' | 'visitor';
    user_id: string;
    imageUrl: string;
    username: string;
    isMe: boolean;
}

export interface Plan {
    name: string;
    uuid: string;
    color: string;
    sub_id?: string;
    void?: boolean;
    plan_data?: {
        each?: 'month' | 'year' | 'life';
        family?: boolean;
        family_data?: {
            owner?: boolean;
        }
    };
    benefits?: Benefits;
};

export interface Benefits {
    planId: string;
    notesLength: number;
    tagsLength: number;
    SilverAI: boolean;
    SilverAILengthPerDay: number;
    ShareNote: boolean;
}

export interface Note {
    id?: number; // plus besoin mais ancien possede encore donc garder
    _id?: string; // for mongodb
    uuid: string;
    icon: string;
    pinned: boolean;
    title: string;
    content: string;
    date: string;
    user_id?: string;
    tags: number[];
    selected?: boolean;
    updated_at?: number;
};

export interface Tag {
    uuid: string;
    _id?: string; // for mongodb
    id: number; // tag encore sous id
    active: boolean;
    name: string;
    color: string;
    user_id: string;
};
