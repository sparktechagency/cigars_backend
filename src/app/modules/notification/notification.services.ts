/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../user/user.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import Notification from './notification.model';
import getAdminNotificationCount from '../../helper/getAdminNotification';
import { getIO } from '../../socket/socket';
import getNotificationCount from '../../helper/getUnseenNotification';
import AppError from '../../error/appError';
import httpStatus from 'http-status';

const getAllNotificationFromDB = async (
    query: Record<string, any>,
    user: JwtPayload
) => {
    if (user?.role === USER_ROLE.superAdmin) {
        const notificationQuery = new QueryBuilder(
            Notification.find({
                $or: [{ receiver: USER_ROLE.superAdmin }, { receiver: 'all' }],
                deleteBy: { $ne: user.profileId },
            }),
            query
        )
            .search(['name'])
            .filter()
            .sort()
            .paginate()
            .fields();
        const result = await notificationQuery.modelQuery;
        const meta = await notificationQuery.countTotal();
        return { meta, result };
    } else {
        const notificationQuery = new QueryBuilder(
            Notification.find({
                $or: [{ receiver: user?.id }, { receiver: 'all' }],
                deleteBy: { $ne: user?.profileId },
            }),

            query
        )
            .search(['title'])
            .filter()
            .sort()
            .paginate()
            .fields();
        const result = await notificationQuery.modelQuery;
        const meta = await notificationQuery.countTotal();
        return { meta, result };
    }
};

const seeNotification = async (user: JwtPayload) => {
    let result;
    const io = getIO();
    if (user?.role === USER_ROLE.superAdmin) {
        result = await Notification.updateMany(
            { $or: [{ receiver: USER_ROLE.superAdmin }, { receiver: 'all' }] },
            { $addToSet: { seenBy: user.profileId } },
            { runValidators: true, new: true }
        );
        const adminUnseenNotificationCount = await getAdminNotificationCount();
        const notificationCount = await getNotificationCount();
        io.emit('admin-notifications', adminUnseenNotificationCount);
        io.emit('notifications', notificationCount);
    }
    if (user?.role !== USER_ROLE.superAdmin) {
        result = await Notification.updateMany(
            { $or: [{ receiver: user.profileid }, { receiver: 'all' }] },
            { $addToSet: { seenBy: user.profileId } },
            { runValidators: true, new: true }
        );
    }
    const notificationCount = await getNotificationCount(user.profileId);
    io.to(user.profileId.toString()).emit('notifications', notificationCount);
    return result;
};

const deleteNotification = async (id: string, profileId: string) => {
    const notification = await Notification.findById(id);
    if (!notification) {
        throw new AppError(httpStatus.NOT_FOUND, 'Notification not found');
    }
    if (notification.receiver == profileId) {
        const reusult = await Notification.findByIdAndDelete(id);
        return reusult;
    } else if (notification.receiver == 'all') {
        const result = await Notification.findByIdAndUpdate(id, {
            $addToSet: { deleteBy: profileId },
        });
        return result;
    } else {
        return null;
    }
};

const notificationService = {
    getAllNotificationFromDB,
    seeNotification,
    deleteNotification,
};

export default notificationService;
