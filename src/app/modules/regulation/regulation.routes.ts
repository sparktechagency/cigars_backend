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

export const regulationRoutes = router;
