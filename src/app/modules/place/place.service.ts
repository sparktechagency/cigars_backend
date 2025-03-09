/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IPlace } from './place.interface';
import Place from './place.model';
import axios from 'axios';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import Category from '../category/category.model';
// add anew place
const addPlace = async (profileId: string, payload: IPlace) => {
  try {
    const { googlePlaceId, placeType } = payload;
    const category = await Category.findById(placeType);
    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, 'This place type not found');
    }
    const existingPlace = await Place.findOne({ googlePlaceId });
    if (existingPlace) {
      throw new AppError(httpStatus.BAD_REQUEST, 'This place already exists');
    }
    const GOOGLE_API_KEY = config.google_api_key;
    const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=name,formatted_address,geometry/location,formatted_phone_number,opening_hours,rating,photos,types&key=${GOOGLE_API_KEY}`;

    const { data } = await axios.get(googleUrl);
    console.log('data', data);
    if (!data.result) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Place not found in Google Maps',
      );
    }
    const placeDetails = data.result;
    const newPlace = {
      addedby: profileId,
      name: placeDetails.name,
      address: placeDetails.formatted_address,
      location: {
        type: 'Point',
        coordinates: [
          placeDetails.geometry.location.lng,
          placeDetails.geometry.location.lat,
        ],
      },
      placeType: payload.placeType,
      phone: placeDetails.formatted_phone_number || '',
      openingHours: {
        monday: placeDetails.opening_hours?.periods?.[0] || {
          open: '',
          close: '',
          closed: true,
        },
        tuesday: placeDetails.opening_hours?.periods?.[1] || {
          open: '',
          close: '',
          closed: true,
        },
        wednesday: placeDetails.opening_hours?.periods?.[2] || {
          open: '',
          close: '',
          closed: true,
        },
        thursday: placeDetails.opening_hours?.periods?.[3] || {
          open: '',
          close: '',
          closed: true,
        },
        friday: placeDetails.opening_hours?.periods?.[4] || {
          open: '',
          close: '',
          closed: true,
        },
        saturday: placeDetails.opening_hours?.periods?.[5] || {
          open: '',
          close: '',
          closed: true,
        },
        sunday: placeDetails.opening_hours?.periods?.[6] || {
          open: '',
          close: '',
          closed: true,
        },
      },
      googlePlaceId,
      averageRating: placeDetails.rating || 0,
      //   images: placeDetails.photos
      //     ? placeDetails.photos.map(
      //         (photo: any) =>
      //           `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`,
      //       )
      //     : [],
    };
    // Save to MongoDB----------------
    const result = await Place.create(newPlace);
    return result;
  } catch (error) {
    console.error('Error fetching place details:', error);
  }
};

const getAllPlace = async (query: Record<string, unknown>) => {
  const placeQuery = new QueryBuilder(
    Place.find()
      .select('name address location placeType')
      .populate({ path: 'placeType', select: 'name image' }),
    query,
  )
    .search(['name', 'address'])
    .fields()
    .filter()
    .paginate()
    .sort();

  const result = await placeQuery.modelQuery;
  const meta = await placeQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSinglePlace = async (id: string) => {
  const place = await Place.findById(id);
  if (!place) {
    throw new AppError(httpStatus.NOT_FOUND, 'Place not found');
  }
  const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
  const lastUpdated = new Date(place.updatedAt).getTime();
  const now = Date.now();

  if (now - lastUpdated > TWO_DAYS) {
    console.log(
      `Updating place details for ${place.name} (last updated: ${place.updatedAt})`,
    );
    const result = await updatePlaceDetails(id);
    return result;
  }
  return place;
};

const updatePlaceDetails = async (placeId: string) => {
  try {
    // Fetch place from database
    const place = await Place.findById(placeId);
    if (!place) {
      throw new AppError(httpStatus.NOT_FOUND, 'Place not found');
    }

    const GOOGLE_API_KEY = config.google_api_key;
    const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.googlePlaceId}&fields=rating,opening_hours,photos&key=${GOOGLE_API_KEY}`;

    const { data } = await axios.get(googleUrl);
    if (!data.result) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Place not found in Google Maps',
      );
    }

    const updatedData = {
      averageRating: data.result.rating || place.averageRating,
      openingHours: {
        monday:
          data.result.opening_hours?.periods?.[0] || place.openingHours.monday,
        tuesday:
          data.result.opening_hours?.periods?.[1] || place.openingHours.tuesday,
        wednesday:
          data.result.opening_hours?.periods?.[2] ||
          place.openingHours.wednesday,
        thursday:
          data.result.opening_hours?.periods?.[3] ||
          place.openingHours.thursday,
        friday:
          data.result.opening_hours?.periods?.[4] || place.openingHours.friday,
        saturday:
          data.result.opening_hours?.periods?.[5] ||
          place.openingHours.saturday,
        sunday:
          data.result.opening_hours?.periods?.[6] || place.openingHours.sunday,
      },
      //   images: data.result.photos
      //     ? data.result.photos.map(
      //         (photo: any) =>
      //           `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`,
      //       )
      //     : place.images,
    };

    // Update place in the database
    const result = await Place.findByIdAndUpdate(placeId, updatedData, {
      new: true,
    });
    return result;
  } catch (error) {
    console.error('Error updating place details:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update place details',
    );
  }
};

const approveRejectPlace = async (id: string, status: string) => {
  const place = await Place.findById(id);
  if (!place) {
    throw new AppError(httpStatus.NOT_FOUND, 'Place not found');
  }
  const result = await Place.findByIdAndUpdate(
    id,
    { status: status },
    { new: true, runValidators: true },
  );
  return result;
};

const PlaceService = {
  addPlace,
  getAllPlace,
  getSinglePlace,
  approveRejectPlace,
};

export default PlaceService;
