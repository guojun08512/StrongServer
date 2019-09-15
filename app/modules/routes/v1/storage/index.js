
import Router from 'koa-router';
import ManageApi from './manage';

const router = Router();
router.use('/manage', ManageApi.routes(), ManageApi.allowedMethods());

export default router;
