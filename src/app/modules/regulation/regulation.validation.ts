import { z } from 'zod';

const regulationSchema = z.object({
    body: z.object({
        country: z
            .string()
            .min(1, 'Country is required')
            .max(255, 'Country is too long'),
        smokingRestriction: z.string().optional(),
        dutyFreeAllowance: z.string().optional(),
    }),
});

export default regulationSchema;
