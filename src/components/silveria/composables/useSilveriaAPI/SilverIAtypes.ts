export interface Chat { 
    uuid: string;
    userID: string;
    data: { notes: any; tags: any };
    messages: any;
}