interface Btn { 
    text: string; 
    action: string, // () => void 
    type: 'default-primary' | 'primary' | 'primary danger'
};

interface NotificationItem {
    id: string;
    title: string;
    content: string; // md format
    date: Date;
    readBy: string[];
    forUserId?: string[];
    btns?: Btn[];
}


export type { NotificationItem, Btn };