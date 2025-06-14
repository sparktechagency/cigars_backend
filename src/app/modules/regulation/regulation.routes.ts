import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import RegulationController from './regulation.controller';
import validateRequest from '../../middlewares/validateRequest';
import regulationSchema, {
    updateRegulationValidationSchema,
} from './regulation.validation';

const router = express.Router();

router.post(
    '/create-regulation',
    auth(USER_ROLE.user, USER_ROLE.superAdmin),
    validateRequest(regulationSchema),
    RegulationController.createRegulation
);
router.patch(
    '/update-regulation/:id',
    auth(USER_ROLE.user, USER_ROLE.superAdmin),
    validateRequest(updateRegulationValidationSchema),
    RegulationController.updateRegulation
);
// get single regulation ---------
router.get(
    '/get-single-regulation',
    // auth(USER_ROLE.superAdmin, USER_ROLE.user),
    RegulationController.getSingleRegulation
);
export const regulationRoutes = router;
