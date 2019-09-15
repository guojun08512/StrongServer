
import Router from 'koa-router';
import userApi from './user';

const router = Router();
router.use('/users', userApi.routes(), userApi.allowedMethods());

export default router;
