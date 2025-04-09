import { z } from 'zod';

const regulationSchema = z.object({
    body: z.object({
        country: z.string({ required_error: 'Country is required' }),
        smokingRestriction: z.string().optional(),
        dutyFreeAllowance: z.string().optional(),
    }),
});
export const updateRegulationValidationSchema = z.object({
    body: z.object({
        country: z.string().optional(),
        smokingRestriction: z.string().optional(),
        dutyFreeAllowance: z.string().optional(),
    }),
});

export default regulationSchema;
