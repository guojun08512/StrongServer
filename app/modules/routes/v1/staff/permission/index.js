
import Router from 'koa-router';
import PermissionRoleApi from './permissionrole';

const router = Router();
router.use('/role', PermissionRoleApi.routes(), PermissionRoleApi.allowedMethods());

export default router;
