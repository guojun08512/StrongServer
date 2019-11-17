
import Router from 'koa-router';
import ManageApi from './manage';
import RoomApi from './room';

const router = Router();
router.use('/manage', ManageApi.routes(), ManageApi.allowedMethods());
router.use('/room', RoomApi.routes(), RoomApi.allowedMethods());

export default router;
