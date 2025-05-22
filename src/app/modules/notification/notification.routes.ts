import { USER_ROLE } from '../user/user.constant';
import express from 'express';
import auth from '../../middlewares/auth';
import notificationController from './notification.controller';
const router = express.Router();

router.get(
    '/get-notifications',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.user,
        USER_ROLE.player,
        USER_ROLE.team
    ),
    notificationController.getAllNotification
);
router.patch(
    '/see-notifications',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.user,
        USER_ROLE.player,
        USER_ROLE.team
    ),
    notificationController.seeNotification
);

router.delete(
    '/delete-notification/:id',
    auth(USER_ROLE.user, USER_ROLE.superAdmin),
    notificationController.deleteNotification
);
//
export const notificationRoutes = router;
