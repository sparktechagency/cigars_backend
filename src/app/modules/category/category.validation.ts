import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Category name is required' })
      .min(1, 'Category name is required'),
    category_image: z
      .string({
        required_error: 'Category image is required',
      })
      .optional(),
  }),
});
const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Category name is required' })
      .min(1, 'Category name is required')
      .optional(),
    category_image: z
      .string({
        required_error: 'Category image is required',
      })
      .optional(),
  }),
});

const categoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};

export default categoryValidation;
