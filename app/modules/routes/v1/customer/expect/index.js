

import Router from 'koa-router';
import Expect from './experience';

const router = Router();
router.use('/', Expect.routes(), Expect.allowedMethods());

export default router;
