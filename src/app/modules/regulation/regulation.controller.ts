import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import RegulationService from './regulation.service';

const createRegulation = catchAsync(async (req, res) => {
    const result = await RegulationService.createRegulation(
        req.user.profieId,
        req.body
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Regulation created successfully',
        data: result,
    });
});
//
const updateRegulation = catchAsync(async (req, res) => {
    const result = await RegulationService.updateRegulation(
        req.user.profileId,
        req.params.id,
        req.body
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Regulation updated successfully',
        data: result,
    });
});
const getSingleRegulation = catchAsync(async (req, res) => {
    const result = await RegulationService.getSingleRegulation(
        req.query.country as string
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Regulation retrieved successfully',
        data: result,
    });
});

const RegulationController = {
    createRegulation,
    updateRegulation,
    getSingleRegulation,
};

export default RegulationController;
