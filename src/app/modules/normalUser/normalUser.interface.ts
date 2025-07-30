/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export interface INormalUser {
    user: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    profile_image: string;
    playerId: string;
}
