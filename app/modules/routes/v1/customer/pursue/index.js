
import Router from 'koa-router';
import Follow from './follow';

const router = Router();
router.use('/', Follow.routes(), Follow.allowedMethods());

export default router;
