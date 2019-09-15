
import Router from 'koa-router';
import PermissionRoleApi from './manage';

const router = Router();
router.use('/role', PermissionRoleApi.routes(), PermissionRoleApi.allowedMethods());

export default router;
