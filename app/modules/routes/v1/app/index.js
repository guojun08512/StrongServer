
import Router from 'koa-router';
import sport from './sport';
import MyMessage from './mymessage';
import Login from './login';

const router = Router();
router.use('/sport', sport.routes(), sport.allowedMethods());
router.use('/mymessage', MyMessage.routes(), MyMessage.allowedMethods());
router.use('/login', Login.routes(), Login.allowedMethods());

export default router;
