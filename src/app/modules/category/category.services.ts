import httpStatus from 'http-status';
import AppError from '../../error/appError';
import mongoose from 'mongoose';
import { ICategory } from './category.interface';
import Category from './category.model';

// create category into db
const createCategoryIntoDB = async (payload: ICategory) => {
  const result = await Category.create(payload);
  return result;
};
const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<ICategory>,
) => {
  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const getAllCategories = async () => {
  const result = await Category.find();
  return result;
};

const getSingleCategory = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  return category;
};
// delete category
const deleteCategoryFromDB = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId, {
      session,
    });

    if (!deletedCategory) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Category not found or does not belong to this shop',
      );
    }

    await session.commitTransaction();
    session.endSession();

    return deletedCategory;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error instanceof mongoose.Error) {
      throw new AppError(500, `Mongoose Error: ${error.message}`);
    }
  }
};

const categoryService = {
  createCategoryIntoDB,
  updateCategoryIntoDB,
  getAllCategories,
  getSingleCategory,
  deleteCategoryFromDB,
};

export default categoryService;
