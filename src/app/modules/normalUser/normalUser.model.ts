import { model, Schema } from 'mongoose';
import { INormalUser } from './normalUser.interface';

const NormalUserSchema = new Schema<INormalUser>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            // required: true,
            default: '',
        },
        email: {
            type: String,
            // required: true,
            // unique: true,
            default: '',
        },
        profile_image: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);
const NormalUser = model<INormalUser>('NormalUser', NormalUserSchema);

export default NormalUser;
