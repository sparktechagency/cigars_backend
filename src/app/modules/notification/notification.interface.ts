export interface INotification {
    title: string;
    message: string;
    receiver: string;
    deleteBy: string[];
    seenBy: string[];
}
