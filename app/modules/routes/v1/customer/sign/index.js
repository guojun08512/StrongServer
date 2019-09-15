
import Router from 'koa-router';
import SignIn from './signin';

const router = Router();
router.use('/', SignIn.routes(), SignIn.allowedMethods());

export default router;
