import { Types } from 'mongoose';
import { ENUM_PlACE_STATUS } from '../../utilities/enum';

export interface IPlace {
    addedby: Types.ObjectId;
    name: string;
    address: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    placeType: Types.ObjectId;
    phone?: string;
    openingHours: {
        monday: { open: string; close: string; closed: boolean };
        tuesday: { open: string; close: string; closed: boolean };
        wednesday: { open: string; close: string; closed: boolean };
        thursday: { open: string; close: string; closed: boolean };
        friday: { open: string; close: string; closed: boolean };
        saturday: { open: string; close: string; closed: boolean };
        sunday: { open: string; close: string; closed: boolean };
    };
    openingHour: string[];
    googlePlaceId: string;
    averageRating: number;
    status: (typeof ENUM_PlACE_STATUS)[keyof typeof ENUM_PlACE_STATUS];
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
