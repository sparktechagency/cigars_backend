import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import PlaceService from './place.service';

const addPlace = catchAsync(async (req, res) => {
    const result = await PlaceService.addPlace(req.user.profileId, req?.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Place added successfully',
        data: result,
    });
});
const getAllPlace = catchAsync(async (req, res) => {
    const result = await PlaceService.getAllPlace(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Place retrieved successfully',
        data: result,
    });
});
const getSinglePlace = catchAsync(async (req, res) => {
    const result = await PlaceService.getSinglePlace(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Place retrieved successfully',
        data: result,
    });
});
const approveRejectPlace = catchAsync(async (req, res) => {
    const result = await PlaceService.approveRejectPlace(
        req.params.id,
        req.body.status
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Place is ${result?.status} successfully`,
        data: result,
    });
});

const PlaceController = {
    addPlace,
    getAllPlace,
    getSinglePlace,
    approveRejectPlace,
};

export default PlaceController;
