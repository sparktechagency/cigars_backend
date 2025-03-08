import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import categoryService from './category.services';

const createCategory = catchAsync(async (req, res) => {
  const { files } = req;
  if (files && typeof files === 'object' && 'category_image' in files) {
    req.body.category_image = files['category_image'][0].path;
  }
  const result = await categoryService.createCategoryIntoDB(req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});
const getSingleCategory = catchAsync(async (req, res) => {
  const result = await categoryService.getSingleCategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { files } = req;

  // Check if files and store_image exist, and process multiple images
  if (files && typeof files === 'object' && 'category_image' in files) {
    req.body.category_image = files['category_image'][0].path;
  }

  const result = await categoryService.updateCategoryIntoDB(
    req?.params?.id,
    req?.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

// delete category
const deleteCategory = catchAsync(async (req, res) => {
  const result = await categoryService.deleteCategoryFromDB(req?.params?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});

const categoryController = {
  createCategory,
  updateCategory,
  getSingleCategory,
  deleteCategory,
  getAllCategories,
};
export default categoryController;
