export interface AppError {
    id: string;
    show: boolean;
    little?: boolean;
    place?: string;
    message?: string;
    error?: "400" | "500" | "unknow";
    more?: string;
    timestamp: Date;
}
