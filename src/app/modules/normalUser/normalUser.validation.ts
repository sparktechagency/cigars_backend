import { z } from 'zod';

export const createNormalUserSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be 6 character' }),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(6, { message: 'Password must be 6 character' }),
    userData: z.object({
      firstName: z.string().nonempty('Name is required'),
      lastName: z.string().nonempty('Name is required'),
      email: z.string().email('Invalid email format'),
    }),
  }),
});
export const updateNormalUserData = z.object({
  body: z.object({
    name: z.string().nonempty('Name is required').optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

const normalUserValidations = {
  createNormalUserSchema,
  updateNormalUserData,
};

export default normalUserValidations;
