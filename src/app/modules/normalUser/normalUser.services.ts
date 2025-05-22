import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { INormalUser } from './normalUser.interface';
import NormalUser from './normalUser.model';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../user/user.constant';
import SuperAdmin from '../superAdmin/superAdmin.model';
import { deleteFileFromS3 } from '../../helper/deleteFromS3';

const updateUserProfile = async (
    userData: JwtPayload,
    payload: Partial<INormalUser>
) => {
    if (payload.email) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You can not change the email'
        );
    }
    if (userData.role == USER_ROLE.user) {
        const user = await NormalUser.findById(userData.profileId);
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'Profile not found');
        }
        const result = await NormalUser.findByIdAndUpdate(
            userData.profileId,
            payload,
            {
                new: true,
                runValidators: true,
            }
        );
        if (payload.profile_image && user.profile_image) {
            deleteFileFromS3(user.profile_image);
        }
        return result;
    } else if (userData.role == USER_ROLE.superAdmin) {
        const admin = await SuperAdmin.findById(userData.profileId);
        if (!admin) {
            throw new AppError(httpStatus.NOT_FOUND, 'Profile not found');
        }
        const reuslt = await SuperAdmin.findByIdAndUpdate(
            userData.profileId,
            payload,
            { new: true, runValidators: true }
        );
        if (payload.profile_image && admin.profile_image) {
            deleteFileFromS3(admin.profile_image);
        }
        return reuslt;
    }
};

const NormalUserServices = {
    updateUserProfile,
};

export default NormalUserServices;
