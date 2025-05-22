import { model, Schema } from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new Schema<INotification>(
    {
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        receiver: {
            type: String,
            required: true,
        },
        deleteBy: {
            type: [String],
            default: [],
        },
        seenBy: {
            type: [String],
            default: [],
        },
    },
    //-------------------------
    {
        timestamps: true,
    }
);

const Notification = model<INotification>('Notification', notificationSchema);

export default Notification;
