import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IRegulation } from './regulation.interface';
import Regulation from './regulation.model';
import Notification from '../notification/notification.model';
import NormalUser from '../normalUser/normalUser.model';
import { getIO } from '../../socket/socket';
import getNotificationCount from '../../helper/getUnseenNotification';

const createRegulation = async (profileId: string, payload: IRegulation) => {
    const io = getIO();
    const result = await Regulation.create(payload);
    const user = await NormalUser.findById(profileId);
    await Notification.create({
        title: user ? user.firstName + user.lastName : 'Admin',
        message: result.smokingRestriction
            ? `Added smoking regulation for ${result.country}`
            : `Added duty free allowance for ${result.country}`,
        receiver: 'all',
    });
    const notificationCount = await getNotificationCount();
    io.emit('notifications', notificationCount);
    return result;
};

const updateRegulation = async (
    profileId: string,
    id: string,
    payload: Partial<IRegulation>
) => {
    const regulation = await Regulation.findById(id);
    if (!regulation) {
        throw new AppError(httpStatus.NOT_FOUND, 'Regulation not found');
    }

    const result = await Regulation.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    const user = await NormalUser.findById(profileId);
    await Notification.create({
        title: user ? user.firstName + user.lastName : 'Admin',
        message:
            payload?.smokingRestriction && !regulation?.smokingRestriction
                ? `Added smoking regulation for ${result?.country}`
                : payload.dutyFreeAllowance && !regulation?.dutyFreeAllowance
                  ? `Added duty free allowance for ${result?.country}`
                  : payload.smokingRestriction && regulation?.smokingRestriction
                    ? `Updated smoking regulation for ${result?.country}`
                    : 'Updated duty free allowance for ${result?.country}',
        receiver: 'all',
    });

    const notificationCount = await getNotificationCount();
    const io = getIO();
    io.emit('notifications', notificationCount);

    return result;
};

const getSingleRegulation = async (country: string) => {
    const result = await Regulation.findOne({ country: country });
    if (result) {
        return result;
    }
    return null;
};

const RegulationService = {
    createRegulation,
    updateRegulation,
    getSingleRegulation,
};

export default RegulationService;
