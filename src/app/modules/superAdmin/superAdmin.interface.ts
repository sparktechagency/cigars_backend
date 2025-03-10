import { Types } from 'mongoose';

export interface ISuperAdmin {
  user: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  profile_image: string;
}
