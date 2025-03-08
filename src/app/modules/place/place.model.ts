import mongoose, { Schema } from 'mongoose';
import { IPlace } from './place.interface';

const PlaceSchema = new Schema<IPlace>(
  {
    addedby: { type: Schema.Types.ObjectId, required: true, ref: 'NormalUser' },
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true, default: 'Point' },
      coordinates: { type: [Number], required: true, index: '2dsphere' },
    },
    placeType: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
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
    googlePlaceId: { type: String, required: true, unique: true },
    averageRating: { type: Number, required: true, default: 0 },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Place = mongoose.model<IPlace>('Place', PlaceSchema);

export default Place;
