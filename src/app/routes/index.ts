import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { ManageRoutes } from '../modules/manage-web/manage.routes';
import { normalUserRoutes } from '../modules/normalUser/normalUser.routes';

import { notificationRoutes } from '../modules/notification/notification.routes';
import { placeRoutes } from '../modules/place/place.routes';
import { regulationRoutes } from '../modules/regulation/regulation.routes';
import { categoryRoutes } from '../modules/category/category.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    router: authRoutes,
  },
  {
    path: '/user',
    router: userRoutes,
  },
  {
    path: '/normal-user',
    router: normalUserRoutes,
  },

  {
    path: '/manage',
    router: ManageRoutes,
  },
  {
    path: '/notification',
    router: notificationRoutes,
  },
  {
    path: '/place',
    router: placeRoutes,
  },
  {
    path: '/regulation',
    router: regulationRoutes,
  },
  {
    path: '/category',
    router: categoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
