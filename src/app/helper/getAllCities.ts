import Place from '../modules/place/place.model';

export const getAllCities = async () => {
    const cities = await Place.aggregate([
        {
            $match: {
                city: {
                    $ne: '',
                    $exists: true,
                },
            },
        },
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
