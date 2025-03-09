import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import RegulationController from './regulation.controller';

const router = express.Router();

router.post(
  '/create-regulation',
  auth(USER_ROLE.user, USER_ROLE.superAdmin),
  RegulationController.createRegulation,
);
router.patch(
  '/update-regulation/:id',
  auth(USER_ROLE.user, USER_ROLE.superAdmin),
  RegulationController.updateRegulation,
);
export const regulationRoutes = router;
