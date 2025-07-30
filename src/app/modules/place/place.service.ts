/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IPlace } from './place.interface';
import Place from './place.model';
import axios from 'axios';
import config from '../../config';
import Category from '../category/category.model';
import mongoose from 'mongoose';
import Notification from '../notification/notification.model';
import NormalUser from '../normalUser/normalUser.model';
// import { getIO } from '../../socket/socket';
// import getNotificationCount from '../../helper/getUnseenNotification';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../user/user.constant';
import { ENUM_PlACE_STATUS } from '../../utilities/enum';
import SuperAdmin from '../superAdmin/superAdmin.model';
import { sendSinglePushNotification } from '../../helper/sendPushNotification';
// import { User } from '../user/user.model';

// function extractCity(place: any) {
//     if (!place || !place.address_components) return null;

//     const cityComponent = place.address_components.find((component: any) =>
//         component.types.includes('locality')
//     );

//     return cityComponent ? cityComponent.long_name : null;
// }

function extractCity(addressComponents: any) {
    if (!addressComponents || !Array.isArray(addressComponents)) return null;

    // Priority order of types to check for "city"
    const priorityTypes = [
        'locality', // Preferred
        'administrative_area_level_2', // Often city or municipality
        'administrative_area_level_3', // Sub-district
        'postal_town', // UK-specific fallback
    ];

    for (const type of priorityTypes) {
        const component = addressComponents.find((c) => c.types.includes(type));
        if (component) return component.long_name;
    }

    return null; // Could not find a suitable city component
}
function extractCountry(place: any) {
    if (!place || !place.address_components) return null;

    const countryComponent = place.address_components.find((component: any) =>
        component.types.includes('country')
    );

    return countryComponent ? countryComponent.long_name : null;
}
// add anew place---------------------------
const addPlace = async (userData: JwtPayload, payload: IPlace) => {
    const { profileId } = userData;
    // const io = getIO();
    const { googlePlaceId, placeType, description } = payload;
    const category = await Category.findById(placeType);
    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, 'This place type not found');
    }
    const existingPlace = await Place.findOne({ googlePlaceId });
    if (existingPlace) {
        throw new AppError(httpStatus.BAD_REQUEST, 'This place already exists');
    }
    const GOOGLE_API_KEY = config.google_api_key;
    // const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=name,formatted_address,geometry/location,formatted_phone_number,opening_hours,rating,photos,types&key=${GOOGLE_API_KEY}`;
    const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=name,formatted_address,geometry/location,formatted_phone_number,opening_hours,rating,types,address_components&key=${GOOGLE_API_KEY}`;
    const { data }: { data: any } = await axios.get(googleUrl);
    if (!data.result) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Place not found in Google Maps'
        );
    }
    const placeDetails = data.result;
    const country = extractCountry(placeDetails);
    // const addressParts = placeDetails?.formatted_address?.split(', ');
    // const city = addressParts[addressParts.length - 3];
    const city = extractCity(placeDetails?.address_components);
    // const country = addressParts[addressParts.length - 1];

    const newPlace: any = {
        addedby: profileId,
        name: placeDetails.name,
        description,
        address: placeDetails.formatted_address,
        location: {
            type: 'Point',
            coordinates: [
                placeDetails.geometry.location.lng,
                placeDetails.geometry.location.lat,
            ],
        },
        city,
        country,
        placeType: payload.placeType,
        phone: placeDetails.formatted_phone_number || '',
        // openingHours: {
        //   monday: placeDetails.opening_hours?.periods?.[0] || {
        //     open: '',
        //     close: '',
        //     closed: true,
        //   },
        //   tuesday: placeDetails.opening_hours?.periods?.[1] || {
        //     open: '',
        //     close: '',
        //     closed: true,
        //   },
        //   wednesday: placeDetails.opening_hours?.periods?.[2] || {
        //     open: '',
        //     close: '',
        //     closed: true,
        //   },
        //   thursday: placeDetails.opening_hours?.periods?.[3] || {
        //     open: '',
        //     close: '',
        //     closed: true,
        //   },
        //   friday: placeDetails.opening_hours?.periods?.[4] || {
        //     open: '',
        //     close: '',
        //     closed: true,
        //   },
        //   saturday: placeDetails.opening_hours?.periods?.[5] || {
        //     open: '',
        //     close: '',
        //     closed: true,
        //   },
        //   sunday: placeDetails.opening_hours?.periods?.[6] || {
        //     open: '',
        //     close: '',
        //     closed: true,
        //   },
        // },

        openingHours:
            placeDetails.opening_hours?.periods?.map((period: any) => ({
                open: period.open?.time || '',
                close: period.close?.time || '',
                openDay: period.open?.day ?? null,
                closeDay: period.close?.day ?? null,
                closed: !period.open && !period.close, // Ensures closed is true if both open & close are missing
            })) || [],
        openingHour: placeDetails?.opening_hours?.weekday_text,
        googlePlaceId,
        averageRating: placeDetails.rating || 0,
        //   images: placeDetails.photos
        //     ? placeDetails.photos.map(
        //         (photo: any) =>
        //           `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`,
        //       )
        //     : [],
    };
    // console.log('new place', newPlace);
    if (userData.role == USER_ROLE.superAdmin) {
        newPlace.status = ENUM_PlACE_STATUS.APPROVED;
    }
    const result = await Place.create(newPlace);
    const user = await NormalUser.findById(profileId);
    await Notification.create({
        title: user ? user.firstName + user.lastName : 'Admin',
        message: `${result.name} has been added to your platform. Please review it!`,
        receiver: USER_ROLE.superAdmin,
    });
    // const notificationCount = await getNotificationCount();

    // io.emit('notifications', notificationCount);
    const admin = await SuperAdmin.findOne();
    await sendSinglePushNotification(
        admin!.user.toString(),
        'New place added!',
        `${result.name} has been added to your platform. Please review it!`,
        { placeId: result._id }
    );

    await sendSinglePushNotification(
        user!.user.toString(),
        'New place added!',
        `Place added successfully , wait for admin review`,
        { placeId: result._id }
    );

    return result;
};

const getAllPlace = async (query: Record<string, unknown>) => {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const maxDistance = Number(query.maxDistance) * 1000 || 5000; // 5 km radius
    const pipeline: any[] = [];

    //apply geo-filtering -------------
    if (query.latitude && query.longitude) {
        pipeline.push({
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [
                        parseFloat(query.longitude as string),
                        parseFloat(query.latitude as string),
                    ],
                },
                distanceField: 'distance',
                maxDistance: maxDistance,
                spherical: true,
            },
        });
        pipeline.push({
            $sort: { distance: -1 },
        });
    } else {
        const sortBy = (query.sortBy as string) || 'updatedAt';
        const sortOrder = (query.sortOrder as string) === 'asc' ? 1 : -1;
        pipeline.push({
            $sort: { [sortBy]: sortOrder },
        });
    }

    // filter conditions --------------------------
    const matchConditions: any = {};
    if (query.country) matchConditions.country = query.country;
    if (query.city) matchConditions.city = query.city;
    if (query.status) matchConditions.status = query.status;
    if (query.placeType)
        matchConditions.placeType = new mongoose.Types.ObjectId(
            query.placeType as string
        );

    if (query.searchTerm) {
        matchConditions.name = {
            $regex: new RegExp(query.searchTerm as string, 'i'),
        };
    }

    if (Object.keys(matchConditions).length > 0) {
        pipeline.push({ $match: matchConditions });
    }

    // for projection---------------
    pipeline.push(
        {
            $project: {
                name: 1,
                address: 1,
                city: 1,
                country: 1,
                location: 1,
                placeType: 1,
                distance: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'placeType',
                foreignField: '_id',
                as: 'placeType',
            },
        },
        {
            $unwind: {
                path: '$placeType',
                preserveNullAndEmptyArrays: true,
            },
        }
    );

    // sorting-----------
    // const sortBy = (query.sortBy as string) || 'updatedAt';
    // const sortOrder = (query.sortOrder as string) === 'asc' ? 1 : -1;
    // pipeline.push({
    //     $sort: { [sortBy]: sortOrder },
    // });

    // Implement pagination and count total records using `$facet`
    pipeline.push({
        $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: limit }],
        },
    });

    const result = await Place.aggregate(pipeline);

    const total = result[0]?.metadata?.[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return {
        meta: {
            total,
            page,
            limit,
            totalPages,
        },
        result: result[0]?.data || [],
    };
};

const getSinglePlace = async (id: string) => {
    const place = await Place.findById(id).populate('placeType');
    if (!place) {
        throw new AppError(httpStatus.NOT_FOUND, 'Place not found');
    }
    //!TODO: if need to increase or decrase update place time
    const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
    const lastUpdated = new Date(place.updatedAt).getTime();
    const now = Date.now();

    if (now - lastUpdated > TWO_DAYS) {
        console.log(
            `Updating place details for ${place.name} (last updated: ${place.updatedAt})`
        );
        const result = await updatePlaceDetails(id);
        return result;
    }
    return place;
};

const updatePlaceDetails = async (placeId: string) => {
    try {
        // Fetch place from database
        const place = await Place.findById(placeId).populate('placeType');
        if (!place) {
            throw new AppError(httpStatus.NOT_FOUND, 'Place not found');
        }

        const GOOGLE_API_KEY = config.google_api_key;
        const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.googlePlaceId}&fields=name,formatted_address,geometry/location,formatted_phone_number,opening_hours,rating,types,address_components&key=${GOOGLE_API_KEY}`;
        const { data }: { data: any } = await axios.get(googleUrl);
        if (!data.result) {
            return place;
        }
        // console.log('data', data.result.address_components);
        const city = extractCity(data?.result.address_components);
        const country = extractCountry(data?.result);
        const updatedData = {
            // updated work
            name: data?.result?.name,
            address: data?.result?.formatted_address,
            location: {
                type: 'Point',
                coordinates: [
                    data?.result?.geometry.location.lng,
                    data?.result?.geometry.location.lat,
                ],
            },
            city,
            country,
            phone: data?.result?.formatted_phone_number || '',
            averageRating: data.result.rating || place.averageRating,
            openingHour: data?.result?.opening_hours?.weekday_text,
            // openingHours:
            //     data?.result?.opening_hours?.periods?.map((period: any) => ({
            //         open: period.open?.time || '',
            //         close: period.close?.time || '',
            //         openDay: period.open?.day ?? null,
            //         closeDay: period.close?.day ?? null,
            //         closed: !period.open && !period.close,
            //     })) || [],
            //   images: data.result.photos
            //     ? data.result.photos.map(
            //         (photo: any) =>
            //           `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`,
            //       )
            //     : place.images,
        };

        const result = await Place.findByIdAndUpdate(placeId, updatedData, {
            new: true,
        }).populate('placeType');
        return result;
    } catch (error) {
        console.error('Error updating place details:', error);
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to update place details'
        );
    }
};

const approveRejectPlace = async (id: string, status: string) => {
    // const io = getIO();
    const place = await Place.findById(id);
    if (!place) {
        throw new AppError(httpStatus.NOT_FOUND, 'Place not found');
    }
    const result = await Place.findByIdAndUpdate(
        id,
        { status: status },
        { new: true, runValidators: true }
    );

    await Notification.create({
        title: `Place ${status}`,
        message: `${place.name} has been ${status} by admin that you added.`,
        receiver: place.addedby,
    });
    // const notificationCount = await getNotificationCount(
    //     place.addedby.toString()
    // );
    // io.to(place.addedby.toString()).emit('notifications', notificationCount);
    const user = await NormalUser.findById(place.addedby).select('user');
    await sendSinglePushNotification(
        user!.user.toString(),
        'New place added!',
        `${place.name} has been ${status} by admin that you added.`,
        { placeId: place._id }
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
