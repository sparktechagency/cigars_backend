/* eslint-disable @typescript-eslint/no-explicit-any */
import Place from '../modules/place/place.model';

export const getAllCities = async (country: string | undefined) => {
    const matchConditions: any = {
        city: { $ne: '', $exists: true },
    };

    if (country) {
        matchConditions.country = country;
    }

    const cities = await Place.aggregate([
        { $match: matchConditions },
        {
            $group: {
                _id: '$city',
            },
        },
        {
            $project: {
                _id: 0,
                city: '$_id',
            },
        },
    ]);

    const cityNames = cities.map((city) => city.city);

    return cityNames;
};

export const getAllCountries = async () => {
    const cities = await Place.aggregate([
        {
            $match: {
                country: {
                    $ne: '',
                    $exists: true,
                },
            },
        },
        {
            $group: {
                _id: '$country',
            },
        },
        {
            $project: {
                _id: 0,
                country: '$_id',
            },
        },
    ]);
    const countryNames = cities.map((country) => country.country);

    return countryNames;
};
