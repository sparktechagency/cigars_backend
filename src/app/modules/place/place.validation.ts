import { z } from 'zod';
import { ENUM_PlACE_STATUS } from '../../utilities/enum';
//
const createPlaceValidationSchema = z.object({
  body: z.object({
    googlePlaceId: z.string({ required_error: 'Google place id is required' }),
    placeType: z.string({ required_error: 'Place type is required' }),
    description: z.string().optional(),
  }),
});

const approveRjectValidationSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(ENUM_PlACE_STATUS) as [string, ...string[]]),
  }),
});

const PlaceValidations = {
  createPlaceValidationSchema,
  approveRjectValidationSchema,
};

export default PlaceValidations;
