import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';

const CategorySchema: Schema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    category_image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Category = model<ICategory>('Category', CategorySchema);

export default Category;
