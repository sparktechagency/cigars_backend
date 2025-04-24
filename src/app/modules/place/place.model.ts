import mongoose, { Schema } from 'mongoose';
import { IPlace } from './place.interface';
import { ENUM_PlACE_STATUS } from '../../utilities/enum';

const PlaceSchema = new Schema<IPlace>(
    {
        addedby: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'NormalUser',
        },
        name: { type: String, required: true },
        description: { type: String, default: '' },
        address: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point',
            },
            coordinates: { type: [Number], required: true, index: '2dsphere' },
        },
        city: { type: String, default: '' },
        country: { type: String, default: '' },
        placeType: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        phone: { type: String, required: false },
        openingHours: {
            monday: { open: String, close: String, closed: Boolean },
            tuesday: { open: String, close: String, closed: Boolean },
            wednesday: { open: String, close: String, closed: Boolean },
            thursday: { open: String, close: String, closed: Boolean },
            friday: { open: String, close: String, closed: Boolean },
            saturday: { open: String, close: String, closed: Boolean },
            sunday: { open: String, close: String, closed: Boolean },
        },
        openingHour: [String],
        googlePlaceId: { type: String, required: true, unique: true },
        averageRating: { type: Number, required: true, default: 0 },
        status: {
            type: String,
            enum: Object.values(ENUM_PlACE_STATUS),
            default: ENUM_PlACE_STATUS.PENDING,
        },
    },
    { timestamps: true }
);

const Place = mongoose.model<IPlace>('Place', PlaceSchema);

export default Place;
