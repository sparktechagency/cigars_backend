import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import PlaceValidations from './place.validation';
import PlaceController from './place.controller';

const router = express.Router();

router.post(
    '/add-place',
    auth(USER_ROLE.user, USER_ROLE.superAdmin),
    validateRequest(PlaceValidations.createPlaceValidationSchema),
    PlaceController.addPlace
);
router.get(
    '/get-all-place',
    auth(USER_ROLE.user, USER_ROLE.superAdmin),
    PlaceController.getAllPlace
);
router.get(
    '/get-single-place/:id',
    auth(USER_ROLE.user, USER_ROLE.superAdmin),
    PlaceController.getSinglePlace
);

router.patch(
    '/approve-reject/:id',
    auth(USER_ROLE.superAdmin),
    validateRequest(PlaceValidations.approveRjectValidationSchema),
    PlaceController.approveRejectPlace
);

export const placeRoutes = router;
