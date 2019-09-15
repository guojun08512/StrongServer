
import Router from 'koa-router';
import HomePage from './homepage';

const router = Router();
router.use('/', HomePage.routes(), HomePage.allowedMethods());

export default router;
